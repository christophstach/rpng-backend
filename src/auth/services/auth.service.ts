import { Injectable } from '@nestjs/common';
import { LoginTokenPayload } from '../interfaces/login-token-payload.interface';
import { UsersService } from '../../users/services/users.service';
import { VerificationTokenService } from './verification-token.service';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { User, UserRole } from '../../users/models/user.model';
import { ConfigService } from '../../shared/services/config/config.service';
import { createHmac } from 'crypto';
import { MailService } from '../../shared/services/mail/mail.service';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly verificationTokenService: VerificationTokenService,
  ) {
  }

  async signPayload(payload: LoginTokenPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validatePayload(payload: LoginTokenPayload) {
    return this.usersService.findOne({ email: payload.email.toLocaleLowerCase() });
  }

  async register({ username, email, password, passwordRepeated, firstName, lastName }): Promise<User> {
    const salt = await genSalt(parseInt(this.configService.get('SALT_ROUNDS'), 10));
    const hmac = createHmac(this.configService.get('VERIFICATION_TOKEN_ALGORITHM'), this.configService.get('VERIFICATION_TOKEN_SECRET'));

    if (password !== passwordRepeated) {
      throw new UserInputError('Passwords are no equal');
    }

    try {
      const roles = await this.usersService.count() === 0 ? [UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN] : [UserRole.USER];
      const passwordHash = await hash(password, salt);
      const user = await this.usersService.create({
        username,
        email,
        password: passwordHash,
        roles,
        firstName,
        lastName,
        verified: false,
      });

      const verificationToken = await this.verificationTokenService.create({
        userId: user.id,
        token: hmac.update(uuid()).digest('hex'),
        expiresIn: moment().add(this.configService.get('VERIFICATION_TOKEN_EXPIRES'), 'second').toDate(),
      });

      this.mailService.send(
        email,
        'E-Mail Verification',
        `
          To verify your E-Mail please click the link bellow.

          ${this.configService.get('VERIFICATION_FRONTEND_URI').replace('{token}', verificationToken.token)}

          Token: ${verificationToken.token}

          Be aware that this verification link expires after 12 hours.
        `,
      );

      return user;
    } catch (e) {
      throw new UserInputError('Username or email already exists');
    }
  }

  async login({ email, password }): Promise<string> {
    const user = await this.usersService.findOne({ email, verified: true });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    const payload: LoginTokenPayload = {
      email: user.email,
      username: user.username,
      roles: user.roles,
    };

    return await this.signPayload(payload);
  }

  async verify({ token }): Promise<User> {
    const verificationToken = await this.verificationTokenService.findOne({ token });

    if (!verificationToken) {
      throw new UserInputError('Invalid token');
    }

    if (verificationToken.expiresIn < new Date()) {
      throw new UserInputError('Token already expired');
    }

    await this.verificationTokenService.delete(verificationToken.id);
    return await this.usersService.update(verificationToken.userId, { verified: true });
  }
}
