import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Sales } from '@prisma/client';
import { CreateSale } from './dto/sales.dto';
import * as speakeasy from '@levminer/speakeasy';
@Injectable()
export class SalesService {
  constructor(private prisma: PrismaClient) {}
  async findAll(companyId: string) {
    const sales = await this.prisma.sales.findMany({
      where: {
        items: {
          some: {
            product: { category: { batch: { company: { id: companyId } } } },
          },
        },
      },
      include: {
        items: { include: { product: { include: { category: true } } } },
      },
      orderBy: { date: 'desc' },
    });
    return sales;
  }


  async createSale(dto: CreateSale): Promise<{ message: string; sale: Sales }> {
    const ref = await speakeasy.totp({
      secret: process.env.API_KEY,
      encoding: 'base32',
      digits: 5,
    });
    let totalAmount = 0; // Initialize total amount

    // Start a transaction
    const sale = await this.prisma.$transaction(async (prisma) => {
      // Create the sale entry
      const sale = await prisma.sales.create({
        data: { date: new Date(), refNo: ref, totalAmount: 0 }, // Set initial totalAmount to 0
      });

      // Iterate over each item to update totalAmount and reduce product quantity
      for (const item of dto.items) {
        const total = item.quantity * item.unitPrice;
        totalAmount += total; // Accumulate total amount for all items

        // Create sale item entries
        await prisma.salesItem.create({
          data: {
            salesId: sale.id,
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: total,
          },
        });

        // Update the product quantity in the database
        await prisma.product.update({
          where: { id: item.product.id },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      // Update the sale with the total amount
      await prisma.sales.update({
        where: { id: sale.id },
        data: { totalAmount },
      });

      return sale;
    });

    return { message: 'Added new sale successfully', sale };
  }

  //get Specific sale
  async getSale(id: string) {
    const sale = await this.prisma.sales.findUnique({
      where: { id },
      include: {
        items: { include: { product: { include: { category: true } } } },
      },
    });
    if (!sale) throw new HttpException('Sale not found', HttpStatus.NOT_FOUND);
    return sale;
  }
}
