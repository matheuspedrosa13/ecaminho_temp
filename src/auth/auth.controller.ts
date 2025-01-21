import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: Record<string, string>) {
    let token = await this.authService.signIn(signInDto.username, signInDto.pass)
    return {message: "Signed In", data: token}
  }
}
