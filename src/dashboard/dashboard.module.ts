import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaClient } from '@prisma/client';
@Module({
  providers: [DashboardService, PrismaClient],
  controllers: [DashboardController],
})
export class DashboardModule {}
