import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    email: string,
    subject: string,
    context: Object,
    template: any,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: template,
        context: context,
      });
    } catch (error) {
      console.log(error);
    }
  }
}