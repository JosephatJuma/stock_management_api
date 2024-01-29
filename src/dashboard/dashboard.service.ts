import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaClient) {}
  async getDashboardData(companyId: string) {
    const totalProducts = await this.prisma.product.count({
      where:  { company: { id: companyId  }  },
    });
    const totalCategories = await this.prisma.category.count({
      where:  { company: { id: companyId  } },
    });
    const totalSales = await this.prisma.sales.count({
      where: {
        items: {
          some: {
            product:  { company: { id: companyId  } },
          },
        },
      },
    });

    // Fetch all products and calculate the stock value

    //     const products = await this.prisma.product.findMany();
    // const stock = products.reduce((acc, product) => {
    //   return acc + (product.quantity * product.unitPrice);
    // }, 0);

    const products = await this.prisma.product.findMany({
      where: { company: { id: companyId  } },
    });
    const stock = products.reduce((totalValue, product) => {
      const productTotal = product.quantity * product.unitPrice;
      return totalValue + productTotal;
    }, 0); // Initialize the total value to 0

    // Calculate net income from sales
    const sales = await this.prisma.sales.findMany({
      where: {
        items: {
          some: {
            product:  { company: { id: companyId  } },
          },
        },
      },
      select: { items: true },
    });
    const gross = await Promise.all(
      sales.map((sale) =>
        Promise.all(
          sale.items.map(async (item) => item.quantity * item.unitPrice),
        ).then((itemsTotal) => itemsTotal.reduce((a, b) => a + b, 0)),
      ),
    );

    const grossSales = gross.reduce((acc, current) => acc + current, 0);

    return {
      totalProducts,
      totalCategories,
      totalSales,
      stock,
      grossSales,
    };
  }

  async getMonthlyStatistics(companyId: string): Promise<any[]> {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let stats = [];
    let currentDate = new Date();

    for (let i = 0; i < months.length; i++) {
      let month = months[i];
      let year = currentDate.getFullYear();
      let startOfMonth = new Date(year, i, 1);

      // Only include months that have already occurred
      if (startOfMonth <= currentDate) {
        let endOfMonth = new Date(year, i + 1, 0);

        let sales = await this.prisma.sales.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            items: {
              some: {
                product: {
                  company: { id: companyId  },
                },
              },
            },
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        let soldProducts = await this.prisma.salesItem.findMany({
          where: {
            sales: {
              date: {
                gte: startOfMonth,
                lte: endOfMonth,
              },
              items: {
                some: {
                  product: {
                   company: { id: companyId  },
                  },
                },
              },
            },
          },
          include: {
            product: true,
          },
        });

        let stock = soldProducts.reduce(
          (acc, salesItem) =>
            acc + salesItem.quantity * salesItem.product.unitPrice,
          0,
        );

        let netIncome = sales._sum.totalAmount - stock;

        stats.push({
          name: month,
          sales: sales._sum.totalAmount || 0,
          stock: stock || 0,
          netIncome: netIncome,
        });
      }
    }

    return stats;
  }

  async getWeeklyStatistics(companyId: string): Promise<any[]> {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const weeksInMonth: Date[][] = [];

    // Calculate the first day and last day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Calculate the number of days in the month
    const numberOfDays = lastDayOfMonth.getDate();

    // Initialize variables to track the current week
    let currentWeek: Date[] = [];
    for (let day = 1; day <= numberOfDays; day++) {
      const currentDay = new Date(year, month, day);

      // Check if the current day is a Sunday or the last day of the month
      const isSunday = currentDay.getDay() === 0;
      const isLastDay = day === numberOfDays;

      // If it's Sunday or the last day, start a new week
      if (isSunday || isLastDay) {
        currentWeek.push(currentDay);
        weeksInMonth.push([...currentWeek]);
        currentWeek = [];
      } else {
        currentWeek.push(currentDay);
      }
    }

    let stats = [];

    // Iterate over each week and calculate statistics
    for (let i = 0; i < weeksInMonth.length; i++) {
      const week = weeksInMonth[i];
      const startOfWeek = week[0];
      const endOfWeek = week[week.length - 1];

      let sales = await this.prisma.sales.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          items: {
            some: {
              product:  { company: { id: companyId  } },
            },
          },
          date: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
      });

      let soldProducts = await this.prisma.salesItem.findMany({
        where: {
          sales: {
            date: {
              gte: startOfWeek,
              lte: endOfWeek,
            },
            items: {
              some: {
                product: {
                  company: { id: companyId },
                },
              },
            },
          },
        },
        include: {
          product: true,
        },
      });

      let stock = soldProducts.reduce(
        (acc, salesItem) =>
          acc + salesItem.quantity * salesItem.product.unitPrice,
        0,
      );

      let netIncome = sales._sum.totalAmount - stock;

      stats.push({
        name: `Week ${i + 1}`,
        sales: sales._sum.totalAmount || 0,
        stock: stock || 0,
        netIncome: netIncome,
      });
    }

    return stats;
  }

  async getDailyStatistics(companyId: string): Promise<any[]> {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    let stats = [];
    let currentDate = new Date();

    for (let i = 0; i < daysOfWeek.length; i++) {
      let day = daysOfWeek[i];
      let year = currentDate.getFullYear();
      let startOfDay = new Date(
        year,
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay() + i,
      );
      let endOfDay = new Date(
        year,
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay() + i + 1,
      );

      // Only include days that have already occurred
      if (startOfDay <= currentDate) {
        let sales = await this.prisma.sales.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            items: {
              some: {
                product: {
                  company: { id: companyId },
                },
              },
            },
            date: {
              gte: startOfDay,
              lt: endOfDay,
            },
          },
        });

        let soldProducts = await this.prisma.salesItem.findMany({
          where: {
            sales: {
              date: {
                gte: startOfDay,
                lt: endOfDay,
              },
              items: {
                some: {
                  product: {
                     company: { id: companyId  },
                  },
                },
              },
            },
          },
          include: {
            product: true,
          },
        });

        let stock = soldProducts.reduce(
          (acc, salesItem) =>
            acc + salesItem.quantity * salesItem.product.unitPrice,
          0,
        );

        let netIncome = sales._sum.totalAmount - stock;

        stats.push({
          name: day,
          sales: sales._sum.totalAmount || 0,
          stock: stock || 0,
          netIncome: netIncome,
        });
      }
    }

    return stats;
  }

  async getHourlyStatistics(companyId: string): Promise<any[]> {
    const hoursOfDay = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
    let stats = [];
    let currentDate = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Nairobi',
    });

    for (let i = 0; i < hoursOfDay.length; i++) {
      let hour = hoursOfDay[i];
      let year = new Date(currentDate).getFullYear();
      let startOfHour = new Date(
        year,
        new Date(currentDate).getMonth(),
        new Date(currentDate).getDate(),
        hour,
        0,
        0,
      );
      let endOfHour = new Date(
        year,
        new Date(currentDate).getMonth(),
        new Date(currentDate).getDate(),
        hour + 1,
        0,
        0,
      );

      // Only include hours that have already occurred
      if (startOfHour <= new Date(currentDate)) {
        let sales = await this.prisma.sales.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            items: {
              some: {
                product: {
                   company: { id: companyId  },
                },
              },
            },
            date: {
              gte: startOfHour,
              lt: endOfHour,
            },
          },
        });

        let soldProducts = await this.prisma.salesItem.findMany({
          where: {
            sales: {
              date: {
                gte: startOfHour,
                lt: endOfHour,
              },
              items: {
                some: {
                  product: {
                     company: { id: companyId },
                  },
                },
              },
            },
          },
          include: {
            product: true,
          },
        });

        let stock = soldProducts.reduce(
          (acc, salesItem) =>
            acc + salesItem.quantity * salesItem.product.unitPrice,
          0,
        );

        let netIncome = sales._sum.totalAmount - stock;

        stats.push({
          name: `${hour}:00 - ${hour + 1}:00`,
          sales: sales._sum.totalAmount || 0,
          stock: stock || 0,
          netIncome: netIncome,
        });
      }
    }

    return stats;
  }
}
