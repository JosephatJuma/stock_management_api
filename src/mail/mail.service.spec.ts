import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

jest.mock('@nestjs-modules/mailer');

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;

  const user: User = { name: 'Juma Josephat' } as User;
  const email = 'jumajosephat61@gmail.com';
  const subject = 'Test Subject';
  const url = 'http://localhost:3000/';
  let template = 'verify-email.hbs';
  const context = { name: user.name, url: url };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  describe('sendEmail', () => {
    it('should send an email with the correct parameters', async () => {
      // Arrange
      const mockSendMail = mailerService.sendMail as jest.Mock;
      mockSendMail.mockResolvedValue(true);

      // Act
      await mailService.sendMail(email, subject, context, template);

      // Assert
      expect(mockSendMail).toHaveBeenCalledWith({
        to: email,
        subject: subject,
        context,
        template: template,
      });
    });
  });
});