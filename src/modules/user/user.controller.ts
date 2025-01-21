import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { eca_genders } from '@prisma/client';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard)
    @Get('')
    async getGenders(){
        const genders = await this.userService.getGenders()
        return {message: "Genders", data: genders}
    }
}
