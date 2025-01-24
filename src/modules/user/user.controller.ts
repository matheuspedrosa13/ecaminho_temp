import { Controller, Get} from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';
import { GenderName } from './model/gender.name.model';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('genders')
    async getGenders() : Promise<HttpResponse<GenderName[]>>{
        const genders = await this.userService.getGenders()
        const response : HttpResponse<GenderName[]> = {
              data: genders,
              message: "Success"
        }
        return response
    }
}
