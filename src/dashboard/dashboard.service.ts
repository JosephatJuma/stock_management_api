import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaClient) {}
  async getDashboardData() {
  const totalProducts = await this.prisma.product.count();
  const totalCategories = await this.prisma.category.count();
  const totalSales = await this.prisma.sales.count();

  // Fetch all products and calculate the stock value
  
    
//     const products = await this.prisma.product.findMany();
// const stock = products.reduce((acc, product) => {
//   return acc + (product.quantity * product.unitPrice);
// }, 0);
    
    const products = await this.prisma.product.findMany();
const stock = products.reduce((totalValue, product) => {
  const productTotal = product.quantity * product.unitPrice;
  return totalValue + productTotal;
}, 0); // Initialize the total value to 0

  // Calculate net income from sales
  const sales = await this.prisma.sales.findMany({ select: { items: true } });
  const income = await Promise.all(
    sales.map(sale =>
      Promise.all(
        sale.items.map(async item => item.quantity * item.unitPrice)
      ).then(itemsTotal => itemsTotal.reduce((a, b) => a + b, 0))
    )
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
      _sum: {
        totalAmount: true,
      },
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
        (sum:any, record:any) => sum + record._sum.totalPrice,
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
async getWeeklyStats() {
  const sales = await this.prisma.sales.groupBy({
    by: ['date'],
    _count: true,
    _sum: {
      totalAmount: true,
    },
  });

  // Group sales by week
  const groupedSales = sales.reduce((acc, sale) => {
    const weekNumber = this.getWeekNumber(sale.date);
    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }
    acc[weekNumber].push(sale);
    return acc;
  }, {});

  // Generate the final data array
  const result = Object.keys(groupedSales).map((weekNumber) => {
    const salesRecords = groupedSales[weekNumber];
    const totalSales = salesRecords.reduce(
      (sum:any, record:any) => sum + record._sum.totalPrice,
      0,
    );
    const stock = salesRecords.length; // Assuming that each sales record represents one unit of stock sold
    const netIncome = totalSales - stock * 100; // Assuming a fixed cost per unit of 100

    return {
      name: `Week ${weekNumber}`,
      sales: totalSales,
      stock: stock,
      netIncome: netIncome,
    };
  });

  return result;
}

// Helper function to get the week number of a date
getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNumber;
}


  
  async getHourlyStats() {
  const sales = await this.prisma.sales.groupBy({
    by: ['date'],
    _count: true,
    _sum: {
      totalAmount: true,
    },
  });

  // Group sales by hour
  const groupedSales = sales.reduce((acc, sale) => {
    const hour = sale.date.getHours();
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(sale);
    return acc;
  }, {});

  // Generate the final data array
  const result = Object.keys(groupedSales).map((hour) => {
    const salesRecords = groupedSales[hour];
    const totalSales = salesRecords.reduce(
      (sum:any, record:any) => sum + record._sum.totalPrice,
      0,
    );
    const stock = salesRecords.length; // Assuming that each sales record represents one unit of stock sold
    const netIncome = totalSales - stock * 100; // Assuming a fixed cost per unit of 100

    return {
      name: `${hour}:00`,
      sales: totalSales,
      stock: stock,
      netIncome: netIncome,
    };
  });

  return result;
}


 
}
