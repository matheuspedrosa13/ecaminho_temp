import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService
  ) {}

  async signIn(signInDto: SigninDto): Promise<{access_token: string}> {
    const user = await this.userService.getUserByEmail(signInDto.email);

    if(!user)
      throw new NotFoundException("User doesn't exists in database");

    if (user?.user_password !== signInDto.password) 
      throw new UnauthorizedException();

    const payload = { sub: user.pk_id, username: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}