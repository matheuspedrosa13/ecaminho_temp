import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { eca_users } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getGenders(){
        return await this.prismaService.eca_genders.findMany()
    }

    async getUserByEmail(userEmail: string) : Promise<eca_users | undefined>{
        return await this.prismaService.eca_users.findFirst({where: {email: userEmail}})
    }
}
