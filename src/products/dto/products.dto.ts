import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsDataURI,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';
import { IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';
class Product {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty({ message: 'Category is required!' })
  categoryId: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;

  @IsNumber()
  @Min(1, { message: 'Unit Price must be greater than 0' })
  unitPrice: number;

  

  @IsOptional()
  @IsDateString()
  expDate: string;
  @IsOptional()
  @IsDateString()
  manDate: string;

  @IsOptional()
  @IsNumber()
  rate: number;

 
}

export class CreateProduct {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Product)
  products: Product[];
}

export class UpdateProduct {
  @IsOptional()
  @IsString({ message: 'Name must be a text!!' })
  @IsNotEmpty({ message: 'Name is required!!' })
  name: string;
  @IsOptional()
  @IsNotEmpty({ message: 'Category is required!!' })
  categoryId: string;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'Quantity is required!!' })
  quantity: number;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'Unit Price is required!' })
  unitPrice: number;
  @IsOptional()
  @IsString({ message: 'Description must be a text!' })
  description: string;
}
