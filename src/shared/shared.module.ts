import { Global, Module } from '@nestjs/common';
import { configService, ConfigService } from './services/config/config.service';
import { MailService } from './services/mail/mail.service';

@Global()
@Module({
  providers: [
    MailService,
    {
      provide: ConfigService,
      useValue: configService,
    },
  ],
  exports: [
    MailService,
    ConfigService,
  ],
})
export class SharedModule {
}
