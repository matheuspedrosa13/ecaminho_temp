import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { HttpResponse } from '../../shared/interfaces/http-response.interface';
import { SkipAuth } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @SkipAuth()
  async signIn(@Body() signInDto: SigninDto) : Promise<HttpResponse<string>>{
    let token = await this.authService.signIn(signInDto)
    const response : HttpResponse<string> = {
      data: token,
      message: "Success"
    }
    return response
  }
}
