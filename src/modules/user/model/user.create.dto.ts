import { ApiProperty } from "@nestjs/swagger";

export class UserCreateDto{
    @ApiProperty({
        description: "User's first name",
        example: 'Lucas'
    })
    username: string;

    @ApiProperty({
        description: "User's last name",
        example: 'Aquino'
    })
    user_lastname: string;

    @ApiProperty({
        description: "User's birth date",
        example: '2007/01/01'
    })
    birth: Date;

    @ApiProperty({
        description: "Gender primary key value to genders table",
        example: '1'
    })
    pfk_eca_genders_id: number;

    @ApiProperty({
        description: "User's email",
        example: 'lucas.aquino@germinare.org.br'
    })
    email: string;

    @ApiProperty({
        description: "User's password",
        example: '@Senha123'
    })
    user_password: string;

    @ApiProperty({
        description: "Company's id",
        example: '1'
    })
    pfk_eca_companies_id: number;

    @ApiProperty({
        description: "User's CPF",
        example: '513.471.328-64'
    })
    cpf: string;

    @ApiProperty({
        description: "User's pix key; NULLABLE",
        example: 'lucas.aquino@germinare.org.br'
    })
    pix?: string | null;

    @ApiProperty({
        description: "User's telephone; NULLABLE",
        example: '11 9502624-22'
    })
    telephone?: string | null;

    @ApiProperty({ description: "User's CNH" })
    cnh?: string | null;

    @ApiProperty({
        description: "User's profile photo as base64"
    }) 
    profile_photo: Buffer | null;
}