import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
@Module({
  providers: [PrismaClient, AuthService],
})
export class AuthModule {}
