import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SempreTokenDto {
    @ApiProperty({
        description: "CPF do usuário que será autenticado no sistema.",
        example: "51347132864"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(11)
    user: string;

    @ApiProperty({
        description: "Código de verificação do token do sempre",
        example: "123456"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    verificationCode: string;
}
