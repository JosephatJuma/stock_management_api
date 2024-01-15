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
import { ProductsService } from './products.service';
import { CreateProduct, UpdateProduct } from './dto/products.dto';
@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Products' })
  async findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create Products' })
  @ApiCreatedResponse({ type: String })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Coughlic Syrus' },
        description: { type: 'string', example: 'Syrus for cough' },
        categoryId: {
          type: 'string',
          example: '8cd801bc-c128-4497-b028-ed66e98a2644',
        },
        quantity: { type: 'number', example: 10 },
        unitPrice: { type: 'number', example: 100 },
      },
    },
  })
  async createProduct(@Body() dto: CreateProduct) {
    return this.productsService.createProduct(dto);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Product' })
  @ApiCreatedResponse({ type: Object })
  async getSingleProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Product' })
  @ApiCreatedResponse({ type: Object })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Coughlic Syrus' },
        description: { type: 'string', example: 'Syrus for cough' },
        categoryId: {
          type: 'string',
          example: '8cd801bc-c128-4497-b028-ed66e98a2644',
        },
        quantity: { type: 'number', example: 10 },
        unitPrice: { type: 'number', example: 100 },
      },
    },
  })
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProduct) {
    return this.productsService.updateProduct(id, dto);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update Single Field' })
  @ApiCreatedResponse({ type: Object })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Coughlic Syrus' },
        description: { type: 'string', example: 'Syrus for cough' },
        categoryId: {
          type: 'string',
          example: '8cd801bc-c128-4497-b028-ed66e98a2644',
        },
        quantity: { type: 'number', example: 10 },
        unitPrice: { type: 'number', example: 100 },
      },
    },
  })
  async editProduct(
    @Param('id') id: string,
    @Query('field') field: string,
    @Body() dto: UpdateProduct,
  ) {
    return this.productsService.editProduct(id, field, dto[field]);
  }

  //delete
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Product' })
  @ApiCreatedResponse({ type: Object })
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
