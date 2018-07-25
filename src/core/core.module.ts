import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { configService } from '../shared/services/config/config.service';

@Module({
  imports: [
    MongooseModule.forRoot(configService.get('DATABASE_CONNECTION_STRING'), { useNewUrlParser: true }),
  ],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
