import { Controller, Get, Post, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';
import { SkipAuth } from '../../constants';

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
    @Post('create')
    async createUser(@Body() createUserDto: any) {
        const user = await this.userService.createUser(createUserDto);
        return { message: 'User created successfully!', data: user };
    }
}
