import { IsNotEmpty,IsString,IsOptional } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    location: string;

    @IsString()
    @IsNotEmpty()
    creatorId: string;
}