import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: "User's e-mail to generate a new jwt token",
    example: 'lucas.aquino@germinare.org.br',
  })
  @IsString()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: "User's password to generate a new jwt token",
    example: 'Senha123*',
  })
  @IsString()
  password: string;
}
