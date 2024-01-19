import { Module } from '@nestjs/common';

import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    AuthModule,
    CompaniesModule,
    CategoriesModule,
    ProductsModule,
    SalesModule,
 
    DashboardModule,
    UsersModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
