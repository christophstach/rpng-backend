import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginTokenPayload } from '../interfaces/login-token-payload.interface';

@Injectable()
export class AttachUserToRequestMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {
  }

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      if (req.headers.authorization) {
        const jwt = req.headers.authorization.slice(7);

        req.user = this.jwtService.decode(jwt, {}) as LoginTokenPayload;
      }

      next();
    };
  }
}
