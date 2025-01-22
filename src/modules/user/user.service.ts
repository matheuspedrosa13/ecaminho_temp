import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { eca_genders, eca_users, Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getGenders(){
        return this.prismaService.eca_genders.findMany({select: {gender_name: true}})
    }

    async getUserByEmail(userEmail: string) : Promise<eca_users | undefined>{
        return await this.prismaService.eca_users.findFirst({where: {email: userEmail}})
    }

    async createUser(createUserDto: {
        username: string;
        user_lastname: string;
        birth: Date;
        pfk_eca_genders_id: number;
        email: string;
        user_password: string;
        pfk_eca_companies_id: number;
        cpf: string;
        pix?: string | null;
        telephone?: string | null;
        cnh?: string | null;
        profile_photo: Buffer | null;
      }): Promise<eca_users> {
        return await this.prismaService.eca_users.create({
          data: {
            username: createUserDto.username,
            user_lastname: createUserDto.user_lastname,
            birth: createUserDto.birth,
            pfk_eca_genders_id: createUserDto.pfk_eca_genders_id,
            email: createUserDto.email,
            user_password: createUserDto.user_password,
            pfk_eca_companies_id: createUserDto.pfk_eca_companies_id,
            cpf: createUserDto.cpf,
            pix: createUserDto.pix,
            telephone: createUserDto.telephone,
            cnh: createUserDto.cnh,
            profile_photo: createUserDto.profile_photo
          },
        });
    }
}
