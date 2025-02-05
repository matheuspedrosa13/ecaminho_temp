import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';
import { SkipAuth } from '../../constants';
import { eca_users } from '@prisma/client';
import { UserCreateDto } from './model/user.create.dto';
import BCryptHelper from 'src/shared/helpers/crypt-password';
import { JwtService } from '@nestjs/jwt';
import { GenderOutput } from './model/gender.output.model';
import { ApiRequestedRangeNotSatisfiableResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    @Get('genders')
    async getGenders() : Promise<HttpResponse<GenderOutput[]>>{
        const genders = await this.userService.getGenders()
        const response : HttpResponse<GenderOutput[]> = {
              data: genders,
              message: "Success"
        }
        return response
    }

    @SkipAuth()
    @Post()
    @ApiTags('user')
    @ApiResponse({ status: 200 })
    async createUser(@Body() createUserDto: UserCreateDto): Promise<HttpResponse<{ user: eca_users, token: string }>> {
        const userPassword = createUserDto.user_password;
    
        const bCrypt = new BCryptHelper();
        createUserDto.user_password = await bCrypt.hash(userPassword);
    
        const user = await this.userService.createUser(createUserDto);

        const payload = { username: user.email, password: user.user_password };
        const token = await this.jwtService.signAsync(payload);
    
        return { 
            message: "User created successfully!", 
            data: { user, token } 
        };
    }    
}
