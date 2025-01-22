import { Controller, Get} from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';

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
}
