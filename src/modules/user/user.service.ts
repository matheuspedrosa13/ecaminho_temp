import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidateToken } from './model/token.validate.model';
import { GenderName } from './model/gender.name.model';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getGenders() : Promise<GenderName[]>{
        return this.prismaService.eca_genders.findMany({select: {gender_name: true}})
    }

    async getUserByEmail(userEmail: string) : Promise<ValidateToken | undefined>{
        return await this.prismaService.eca_users.findFirst({where: {email: userEmail}, select: {pk_id: true, email: true, user_password: true}})
    }
}
