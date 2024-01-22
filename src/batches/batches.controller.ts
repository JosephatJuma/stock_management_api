import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateBatchDto } from './dto/batch.dto';
import { BatchesService } from './batches.service';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
@Controller('batches')
@ApiTags('Batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}
  @Post()
  @ApiOperation({ summary: 'Create Batch' })
  @ApiCreatedResponse({ type: CreateBatchDto })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'January Batch' },
        companyId: { type: 'string', example: '263673826392367289' },
        batchNumber: { type: 'number', example: 1 },
        totalInvestment: { type: 'number', example: 1000000 },
      },
    },
  })
  async createBatch(@Body() dto: CreateBatchDto) {
    return this.batchesService.createBatch(dto);
  }

  //get company batches
  @Get('/:company_id')
  @ApiOperation({ summary: 'Get Company Batches' })
  async getCompanyBatches(@Param('company_id') companyId: string) {
    return this.batchesService.findAll(companyId);
  }

  //get Categories in batch
  @Get('/:id/categories')
  @ApiOperation({ summary: 'Get Categories in Batch' })
  async getCategoriesInBatch(@Param('id') batchId: string) {
    return this.batchesService.findAllCategories(batchId);
  }
}
