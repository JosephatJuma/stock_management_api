import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCompanyDto } from './dto/company.dto';
@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaClient) {}
    async findAll() {
        return await this.prisma.company.findMany();
    }
    async createCompany(dto: CreateCompanyDto) {

        //find creator first
        const creator=await this.prisma.user.findUnique({where:{id:dto.creatorId}});
        if(!creator) throw new HttpException({message:'Creator not found'},HttpStatus.NOT_FOUND);
        const company = await this.prisma.company.create({ data: dto });
        await this.prisma.admin.create({ data: { userId: creator.id,  } });
        return {
            message: 'Company created successfully',
            company,
        };
    }

}
