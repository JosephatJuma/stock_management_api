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
import { CategoriesService } from './categories.service';
import { CreateCategory, UpdateCategory } from './dto/category.dto';
@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post(':company_id')
  @ApiOperation({ summary: 'Create Category' })
  @ApiCreatedResponse({ type: String })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Cough Syrus' },
        description: { type: 'string', example: 'Syrus for cough' },
      },
    },
  })
  async createCategory(@Body() dto: CreateCategory, @Param('company_id') companyId: string) {
    return this.categoriesService.createCategory(dto, companyId);
  }
  @Get(':company_id')
  @ApiOperation({ summary: 'Get Category' })
  @ApiCreatedResponse({ type: Object })
  async getSingleCategory(@Param('company_id') companyId: string) {
    return this.categoriesService.findAll(companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Category' })
  @ApiCreatedResponse({ type: Object })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Cough Syrus' },
        description: { type: 'string', example: 'Syrus for cough' },
      },
    },
  })
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategory) {
    return this.categoriesService.updateCategory(id, dto);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update Single Field' })
  @ApiCreatedResponse({ type: Object })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Cough Syrus' },
        description: { type: 'string', example: 'Syrus for cough' },
      },
    },
  })
  async editCategory(
    @Param('id') id: string,
    @Query('field') field: string,
    @Body() dto: UpdateCategory,
  ) {
    return this.categoriesService.editCategory(id, field, dto[field]);
  }

  //delete
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Category' })
  @ApiCreatedResponse({ type: Object })
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
  @Get('/:batch_id')
  @ApiOperation({ summary: 'Get All Categories' })
  async findAll(@Param('batch_id') batchId: string) {
    return this.categoriesService.findAll(batchId);
  }
  //products
  @Get(':id/products')
  @ApiOperation({ summary: 'Get Products of Category' })
  @ApiCreatedResponse({ type: Array })
  async getCategoryProducts(@Param('id') id: string) {
    return this.categoriesService.getCategoryProducts(id);
  }
}
