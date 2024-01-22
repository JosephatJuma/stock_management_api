import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsDataURI,
  IsDate,
} from 'class-validator';
export class CreateProduct {
  @IsString({ message: 'Name must be a text!!' })
  @IsNotEmpty({ message: 'Name is required!!' })
  name: string;
  @IsNotEmpty({ message: 'Category is required!!' })
  categoryId: string;
  @IsNumber()
  @IsNotEmpty({ message: 'Quantity is required!!' })
  quantity: number;
  @IsNumber()
  @IsNotEmpty({ message: 'Unit Price is required!' })
  unitPrice: number;
  @IsOptional()
  @IsString({ message: 'Description must be a text!' })
  description: string;
  @IsNumber()
  @IsNotEmpty({ message: 'Selling Price is required!' })
  sellingPrice: number;
  @IsOptional()
  @IsDateString()
  expDate: string;
  @IsOptional()
  @IsDateString()
  manDate: string;
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
