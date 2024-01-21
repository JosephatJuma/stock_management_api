import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateBatchDto } from './dto/batch.dto';
@Injectable()
export class BatchesService {
    constructor(private prisma: PrismaClient) {}
    async findAll(companyId: string) {
        return await this.prisma.batch.findMany({where:{companyId}});
    }
    //create Batch

    async findAllCategories(batchId: string) {
        const categories = await this.prisma.category.findMany({
          where: { batchId },
          include: { products: true },
        });
    return categories;}
    async createBatch(dto: CreateBatchDto) {

        const batch = await this.prisma.batch.create({ data: dto });
        return {mesaage:'Batch created successfully',batch};
    }
}
