import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: "User's cpf to generate a new jwt token",
    example: '51347132864',
  })
  @IsString()
  @MaxLength(11)
  cpf: string;

  @ApiProperty({
    description: "User's password to generate a new jwt token",
    example: 'Senha123*',
  })
  @IsString()
  password: string;
}
