import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt-token/jwt-token.service';
import { AuthController } from './auth.controller';
import { MailService } from '../mail/mail.service';
@Module({
  providers: [
    PrismaClient,
    AuthService,
    ConfigService,
    JwtService,
    JwtTokenService,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
