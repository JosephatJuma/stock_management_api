import { Module } from '@nestjs/common';

import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReferenceService } from './reference/reference.service';

@Module({
  imports: [
    CategoriesModule,
    ProductsModule,
    SalesModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [ReferenceService],
})
export class AppModule {}
