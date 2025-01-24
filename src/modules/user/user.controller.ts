import { Controller, Get} from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';
import { GenderOutput } from './model/gender.output.model';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('genders')
    async getGenders() : Promise<HttpResponse<GenderOutput[]>>{
        const genders = await this.userService.getGenders()
        const response : HttpResponse<GenderOutput[]> = {
              data: genders,
              message: "Success"
        }
        return response
    }
}
