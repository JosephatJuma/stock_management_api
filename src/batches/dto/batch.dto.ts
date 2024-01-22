import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsNumber()
  @IsNotEmpty()
  batchNumber: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  totalInvestment: number;
}
