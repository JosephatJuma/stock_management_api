import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [BatchesService, PrismaClient],
  controllers: [BatchesController]
})
export class BatchesModule {}
