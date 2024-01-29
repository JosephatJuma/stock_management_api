import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
export class CreateCategory {
  @IsString({ message: 'Name of the category must be text!' })
  @IsNotEmpty({ message: "Category name can't be empty!" })
  name: string;
  @IsOptional()
  @IsString({ message: 'Description of the category must be text!' })
  @IsNotEmpty({ message: "Description name can't be empty!" })
  desciption: string;
  @IsString()
  @IsNotEmpty({ message: 'You have loggedin in to your company!' })
  companyId: string;
}

export class UpdateCategory {
  @IsOptional()
  @IsString({ message: 'Name of the category must be text!' })
  @IsNotEmpty({ message: "Category name can't be empty!" })
  name: string;
  @IsOptional()
  @IsString({ message: 'Description of the category must be text!' })
  @IsNotEmpty({ message: "Description name can't be empty!" })
  desciption: string;
}
