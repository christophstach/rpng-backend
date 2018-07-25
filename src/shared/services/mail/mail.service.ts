import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as sendgrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async send(to: string, subject: string, message: string) {
    return await sendgrid.send({
      from: 'noreply@christoph.stach.me',
      subject,
      to,
      text: message,
    });
  }
}
