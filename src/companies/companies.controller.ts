import { Controller,Post,Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/company.dto';

@Controller('companies')
@ApiTags('Companies')
export class CompaniesController {
constructor(private readonly companiesService: CompaniesService) {}
    @Post()
    @ApiOperation({ summary: 'Create company' })
    @ApiCreatedResponse({ type: CreateCompanyDto })
    @ApiBody({schema:{
        properties:{
            name:{type:'string',example:'Eden Pharmacy'},
            location:{type:'string', example:'Kimbejja'},
        }
    } })
    async createCompany(@Body() dto: CreateCompanyDto) {
        return this.companiesService.createCompany(dto);
    }
}
