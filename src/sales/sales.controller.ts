import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSale } from './dto/sales.dto';

@Controller('sales')
@ApiTags('Sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Sales' })
  async findAll() {
    return this.salesService.findAll();
  }
  @Post()
  @ApiOperation({ summary: 'Create Sales' })
  @ApiCreatedResponse({ type: Object })
  @ApiBody({
    schema: {
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: {
                type: 'string',
                example: '8fcac866-60fe-4bc6-8d0c-662a4e97c10e',
              },
              quantity: { type: 'number', example: 10 },
              unitPrice: { type: 'number', example: 100 },
            },
          },
        },
      },
    },
  })
  async createSale(@Body() dto: CreateSale) {
    return this.salesService.createSale(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Sales' })
  @ApiCreatedResponse({ type: Object })
  async getSingleSale(@Param('id') id: string) {
    return this.salesService.getSale(id);
  }
}
