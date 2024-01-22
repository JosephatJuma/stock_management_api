import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/company.dto';

@Controller('companies')
@ApiTags('Companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Post()
  @ApiOperation({ summary: 'Create company' })
  @ApiCreatedResponse({ type: CreateCompanyDto })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Eden Pharmacy' },
        location: { type: 'string', example: 'Kimbejja' },
        creatorId: { type: 'string', example: '263673826392367289' },
      },
    },
  })
  async createCompany(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  //get companies
  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  async findAll() {
    return this.companiesService.findAll();
  }
}
