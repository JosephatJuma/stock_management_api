import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCategory, UpdateCategory } from './dto/category.dto';
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaClient) {}
  async findAll(companyId: string) {
    const categories = await this.prisma.category.findMany({
      where: { company: { id: companyId } },
      include: { products: true },
      orderBy: { dateAdded: 'desc' },
    });

    return categories;
  }

  async createCategory(dto: CreateCategory, companyId: string) {
    const exists = await this.prisma.category.findFirst({
      where: { name: dto.name, companyId },
    });
    if (exists)
      throw new HttpException(
        'Category already exists in this batch',
        HttpStatus.CONFLICT,
      );
    await this.prisma.category.create({ data: { ...dto, companyId } });
    return { message: `${dto.name} created Successfully` };
  }

  async deleteCategory(id: string) {
    await this.checkCategoryExists(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
  //get One Category
  async getCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    return category;
  }

  //update category
  async updateCategory(id: string, dto: UpdateCategory) {
    await this.checkCategoryExists(id);
    await this.prisma.category.update({ where: { id }, data: { ...dto } });
    return { message: 'Category updated successfully' };
  }

  //update Single Field
  async editCategory(id: string, field: string, value: string) {
    await this.checkCategoryExists(id);
    const edited = await this.prisma.category.update({
      where: { id },
      data: {
        [field]: value,
      },
    });
    return { message: `${field} updated successfully` };
  }

  //get products of category
  async getCategoryProducts(id: string) {
    await this.checkCategoryExists(id);
    const products = await this.prisma.product.findMany({
      where: { categoryId: id },
    });
    return products;
  }

  //helper methods
  private async checkCategoryExists(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }
}
