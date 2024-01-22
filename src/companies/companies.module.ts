import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { PrismaClient } from '@prisma/client';
@Module({
  providers: [CompaniesService, PrismaClient],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
