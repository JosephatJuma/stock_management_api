import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaClient) {}
  async getDashboardData() {
    const totalProducts = await this.prisma.product.count();
    const totalCategories = await this.prisma.category.count();
    const totalSales = await this.prisma.sales.count();
    const products = await this.prisma.product.findMany();
    const sum = await Promise.all(
      products.map(async (product) => {
        return product.quantity * product.unitPrice;
      }),
    );

    const stock = sum.reduce((acc, current) => acc + current, 0);

    const sales = await this.prisma.sales.findMany({ select: { items: true } });
    const income = await Promise.all(
      sales.map((sale) =>
        Promise.all(
          sale.items.map(async (item) => {
            return item.quantity * item.unitPrice;
          }),
        ).then((itemsTotal) => itemsTotal.reduce((a, b) => a + b, 0)),
      ),
    );

    const netIncome = income.reduce((acc, current) => acc + current, 0);

    return {
      totalProducts,
      totalCategories,
      totalSales,
      stock,
      netIncome,
    };
  }

  async getMonthlyStats() {
    const sales = await this.prisma.sales.groupBy({
      by: ['date'],
      _count: true,
      //  _sum: {

      //  },
    });

    // Group sales by month
    const groupedSales = sales.reduce((acc, sale) => {
      const month = sale.date.getMonth();
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(sale);
      return acc;
    }, []);

    // Generate the final data array
    const result = Object.keys(groupedSales).map((month) => {
      const salesRecords = groupedSales[month];
      const totalSales = salesRecords.reduce(
        (sum, record) => sum + record._sum.totalPrice,
        0,
      );
      const stock = salesRecords.length; // Assuming that each sales record represents one unit of stock sold
      const netIncome = totalSales - stock * 100; // Assuming a fixed cost per unit of 100

      return {
        name: new Date(2000, parseInt(month), 1).toLocaleString('en-us', {
          month: 'long',
        }),
        sales: totalSales,
        stock: stock,
        netIncome: netIncome,
      };
    });

    return result;
  }
}
