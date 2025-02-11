import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDate, IsNumber, IsUUID, IsBase64, IsDateString } from "class-validator";

export class UserCreateDto {
    @ApiProperty({ description: "User's first name", example: 'Lucas' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: "User's last name", example: 'Aquino' })
    @IsString()
    @IsNotEmpty()
    user_lastname: string;

    @ApiProperty({ description: "User's birth date", example: '2007/01/01' })
    @IsDateString()
    @IsNotEmpty()
    birth: Date;

    @ApiProperty({ description: "Gender primary key value to genders table", example: '1' })
    @IsNumber()
    @IsNotEmpty()
    pfk_eca_genders_id: number;

    @ApiProperty({ description: "User's email", example: 'lucas.aquino@germinare.org.br' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: "User's password", example: '@Senha123' })
    @IsString()
    @IsNotEmpty()
    user_password: string;

    @ApiProperty({ description: "Company's id", example: '1' })
    @IsNumber()
    @IsNotEmpty()
    pfk_eca_companies_id: number;

    @ApiProperty({ description: "User's CPF", example: '513.471.328-64' })
    @IsString()
    @IsNotEmpty()
    cpf: string;

    @ApiProperty({ description: "User's pix key; NULLABLE", example: 'lucas.aquino@germinare.org.br' })
    @IsOptional()
    @IsString()
    pix?: string | null;

    @ApiProperty({ description: "User's telephone; NULLABLE", example: '11 9502624-22' })
    @IsOptional()
    @IsString()
    telephone?: string | null;

    @ApiProperty({ description: "User's CNH" })
    @IsOptional()
    @IsString()
    cnh?: string | null;

    @ApiProperty({ description: "User's profile photo as base64" })
    @IsOptional()
    @IsBase64()
    profile_photo?: string | null;
}
