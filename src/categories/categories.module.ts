import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaClient } from '@prisma/client';
import { CategoriesController } from './categories.controller';

@Module({
  providers: [CategoriesService, PrismaClient],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
