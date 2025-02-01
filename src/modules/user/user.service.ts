import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { eca_users } from '@prisma/client';
import { UserCreateDto } from './model/user.create.dto';
import { GenderOutput } from './model/gender.output.model';
import { create } from 'domain';

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
        const userCpf = await this.prismaService.eca_users.findUnique({
            where: { cpf: createUserDto.cpf }
        });

        const userEmail = await this.prismaService.eca_users.findUnique({
            where: {email: createUserDto.email}
        })

        if (userCpf) 
            throw new HttpException("cpf already exists", HttpStatus.CONFLICT);
        
        if (userEmail) 
            throw new HttpException("email already exists", HttpStatus.CONFLICT);
    
        return await this.prismaService.eca_users.create({data: createUserDto});
    }
}
