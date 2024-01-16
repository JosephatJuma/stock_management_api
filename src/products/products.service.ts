import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProduct, UpdateProduct } from './dto/products.dto';
import * as speakeasy from '@levminer/speakeasy';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    const products = await this.prisma.product.findMany({include: {category: {select: {name: true, }}}, orderBy:{dateAdded: 'desc'}});
    return products;
  }
  //add
  async createProduct(dto: CreateProduct) {
    const exists = await this.prisma.product.findFirst({
      where: { AND: [{ name: dto.name }, { categoryId: dto.categoryId }] },
    });
    if (exists)
      throw new HttpException('Product already exists', HttpStatus.CONFLICT);
    const ref = await speakeasy.totp({ secret: process.env.API_KEY, encoding: 'base32', digits:5 });
    const product = await this.prisma.product.create({
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        refNo: ref,
      },
    });
    return { message: `${product.name} created Successfully`, product };
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
