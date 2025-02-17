import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { eca_users } from '@prisma/client';
import { UserCreateDto } from './model/user.create.dto';
import { ValidateToken } from './model/token.validate.model';
import { GenderOutput } from './model/gender.output.model';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getGenders(): Promise<GenderOutput[]> {
        return this.prismaService.eca_genders.findMany({ select: { gender_name: true } });
    }

    async getUserByCpf(userCpf: string): Promise<ValidateToken | undefined> {
        return await this.prismaService.eca_users.findFirst({
            where: { cpf: userCpf },
            select: { pk_id: true, cpf: true, email: true, user_password: true }
        });
    }

    async verifyCpf(userCpf: string): Promise<boolean> {
        const user = await this.prismaService.eca_users.findFirst({
            where: { cpf: userCpf },
            select: { pk_id: true }
        });

        const userExists = user !== null;
        return userExists;
    }

    async createUser(createUserDto: UserCreateDto): Promise<eca_users> {
        return await this.prismaService.eca_users.create({ data: createUserDto });
    }
}
