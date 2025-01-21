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
}
