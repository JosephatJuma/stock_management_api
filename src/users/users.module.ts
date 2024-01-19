import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
@Module({
  providers: [UsersService, PrismaClient],
})
export class UsersModule {}
