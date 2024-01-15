import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaClient } from '@prisma/client';
import { ProductsController } from './products.controller';
@Module({
  providers: [ProductsService, PrismaClient],
  controllers: [ProductsController],
})
export class ProductsModule {}
