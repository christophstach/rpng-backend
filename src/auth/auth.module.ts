import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AttachUserToRequestMiddleware } from './middlewares/attach-user-to-request.middleware';
import { configService } from '../shared/services/config/config.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationTokenMongooseSchema } from './mongoose-schemas/verification-token.mongoose-schema';
import { VerificationTokenService } from './services/verification-token.service';

@Module({
  imports: [
    JwtModule.register({
      secretOrPrivateKey: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRES'),
      },
    }),
    MongooseModule.forFeature([
      { name: 'VerificationToken', schema: VerificationTokenMongooseSchema },
    ]),
    UsersModule,
  ],
  providers: [
    AuthService,
    VerificationTokenService,
    AuthResolver,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
    AuthService,
    VerificationTokenService,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AttachUserToRequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
