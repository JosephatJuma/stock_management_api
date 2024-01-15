import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateSale } from './dto/sales.dto';
@Injectable()
export class SalesService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    const sales = await this.prisma.sales.findMany({
      include: {
        items: { include: { product: { include: { category: true } } } },
      },
    });
    return sales;
  }

  //create
  async createSale(dto: CreateSale) {
    const sale = await this.prisma.sales.create({ data: { date: new Date() } });
    await Promise.all(
      dto.items.map(async (item) => {
        const total = item.quantity * item.unitPrice;
        return this.prisma.salesItem.create({
          data: {
            salesId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: total,
          },
        });
      }),
    );
    //   console.log(dto)
    return { message: `Added new sale successfully`, sale };
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
