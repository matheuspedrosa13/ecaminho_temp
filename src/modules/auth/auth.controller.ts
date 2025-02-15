import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { HttpResponse } from '../../shared/interfaces/http-response.interface';
import { SkipAuth } from 'src/constants';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SempreTokenDto } from './dto/sempre-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiTags('auth')
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'User not found in database.' })
  @ApiResponse({ status: 401, description: 'Unmatched passwords.' })
  @SkipAuth()
  async signIn(@Body() signInDto: SigninDto): Promise<HttpResponse<string>> {
    const token = await this.authService.signIn(signInDto);
    const response: HttpResponse<string> = {
      data: token,
      message: 'Success',
    };

    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup/sempre')
  @ApiTags('auth')
  @ApiResponse({ status: 200, type: Boolean })
  @SkipAuth()
  async signupSempre(@Body() sempreTokenDto: SempreTokenDto) : Promise<HttpResponse<boolean>> {
      const isUserValid = await this.authService.signUpSempre(sempreTokenDto)
      const response: HttpResponse<boolean> = {
          data: isUserValid,
          message: isUserValid ? "" : "Token inválido para CPF informado!"
      }

      return response
  }
}
