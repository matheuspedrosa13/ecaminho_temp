import { Controller, Get, Post, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';
import { SkipAuth } from '../../constants';
import { eca_users } from '@prisma/client';
import { UserCreateDto } from './model/user.create.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('genders')
    async getGenders(){
        const genders = await this.userService.getGenders()
        const response : HttpResponse<any> = {
              data: genders,
              message: "Success"
        }
        return response
    }

    @SkipAuth()
    @Post()
    async createUser(@Body() createUserDto: UserCreateDto) : Promise<HttpResponse<eca_users>> {
        const user = await this.userService.createUser(createUserDto);
        const response : HttpResponse<eca_users> = {
            data: user,
            message: "Success"
        }
        return { message: 'User created successfully!', data: user };
    }
}
