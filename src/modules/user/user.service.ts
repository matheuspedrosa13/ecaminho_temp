import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { eca_users } from '@prisma/client';
import { UserCreateDto } from './model/user.create.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getGenders() : Promise<GenderOutput[]>{
        return this.prismaService.eca_genders.findMany({select: {gender_name: true}})
    }

    async getUserByEmail(userEmail: string) : Promise<eca_users | undefined>{
        return await this.prismaService.eca_users.findFirst({where: {email: userEmail}})
    }

    async createUser(createUserDto: UserCreateDto) : Promise<eca_users> {
        return await this.prismaService.eca_users.create({data: createUserDto});
    }
}
