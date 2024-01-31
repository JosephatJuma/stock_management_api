import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';
import { CreateProduct, UpdateProduct } from './dto/products.dto';
import * as speakeasy from '@levminer/speakeasy';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaClient) {}
  async findAll(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: {   company: { id: companyId }   },
      include: { category: true },
      orderBy: { dateAdded: 'desc' },
    });
    return products;
  }
  //add
  // async createProduct(dto: CreateProduct) {
  //   const exists = await this.prisma.product.findFirst({
  //     where: { AND: [{ name: dto.name }, { categoryId: dto.categoryId }] },
  //   });
  //   if (exists)
  //     throw new HttpException('Product already exists', HttpStatus.CONFLICT);
  //   const ref = await speakeasy.totp({
  //     secret: process.env.API_KEY,
  //     encoding: 'base32',
  //     digits: 5,
  //   });
  //   const product = await this.prisma.product.create({
  //     data: {
  //       categoryId: dto.categoryId,
  //       name: dto.name,
  //       quantity: dto.quantity,
  //       unitPrice: dto.unitPrice,
  //       refNo: ref,
  //       manDate: dto.manDate,
  //       expDate: dto.expDate,
  //     },
  //   });
  //   return { message: `${product.name} created Successfully`, product };
  // }

  async createProduct(dto: CreateProduct, companyId: string): Promise<{ message: string }> {
    // Iterate over each product to update totalAmount and reduce product quantity
    for (const product of dto.products) {
      const sellingPrice = product.unitPrice * product.rate;
      const expirayDate = new Date(product.expDate);
      // Accumulate total amount for all products
      const ref = await speakeasy.totp({
        secret: process.env.API_KEY,
        encoding: 'base32',
        digits: 5,
      });
      // Create product entries
      await this.prisma.product.create({
        data: {
          categoryId: product.categoryId,
          name: product.name,
          quantity: product.quantity,
          unitPrice: product.unitPrice,
          manDate: product.manDate,
          expDate: expirayDate,
          sellingPrice:  sellingPrice,
          refNo: ref,
          rate: product.rate,
          companyId,
        },
      });
    }
    const message = `Added new ${dto.products.length} ${dto.products.length > 1 ? 'products' : 'product'} successfully`;
    return { message };
  }

  //get one
  async getProduct(id: string) {
    await this.checkProductExists(id);
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product;
  }

  //update
  //update product
  async updateProduct(id: string, dto: UpdateProduct) {
    await this.checkProductExists(id);
    await this.prisma.product.update({ where: { id }, data: { ...dto } });
    return { message: 'Product updated successfully' };
  }

  //update Single Field
  async editProduct(id: string, field: string, value: string) {
    await this.checkProductExists(id);
    const edited = await this.prisma.product.update({
      where: { id },
      data: {
        [field]: value,
      },
    });
    return { message: `${field} updated successfully` };
  }

  //delete
  async deleteProduct(id: string) {
    await this.checkProductExists(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  //helper methods
  private async checkProductExists(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }
}
