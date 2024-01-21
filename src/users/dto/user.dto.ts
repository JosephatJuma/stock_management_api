import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()

  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsUUID()
  @IsOptional()
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

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()

  password: string;
  @IsString()
  @IsNotEmpty()
  companyName: string;

}
