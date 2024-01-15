import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaClient } from '@prisma/client';
@Module({
  providers: [SalesService, PrismaClient],
  controllers: [SalesController],
})
export class SalesModule {}
