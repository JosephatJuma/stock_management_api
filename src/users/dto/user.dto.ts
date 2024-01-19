import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty({ message: 'You must select your company' })
  companyId: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password: string;
}
