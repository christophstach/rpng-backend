import { Injectable, Logger, LoggerService, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger: LoggerService;

  constructor() {
    this.logger = new Logger(RequestLoggerMiddleware.name);
  }

  resolve(...args: any[]): MiddlewareFunction {
    return (req: Request, res: Response, next) => {
      if (res.statusCode !== 200) {
        this.logger.warn(`${req.method} ${req.originalUrl} ${res.statusCode}`);
      } else {
        this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
      }

      next();
    };
  }
}
