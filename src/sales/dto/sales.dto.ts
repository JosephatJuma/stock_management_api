import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Interface } from 'readline';
import { Product } from '@prisma/client';
class Item {
  @IsNotEmpty()
  product: Product;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CreateSale {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}
