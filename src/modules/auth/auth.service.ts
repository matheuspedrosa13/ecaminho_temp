import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import BCryptHelper from 'src/shared/helpers/crypt-password';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService
  ) {}

  async signIn(signInDto: SigninDto): Promise<string> {
    const user = await this.userService.getUserByEmail(signInDto.email);

    if(!user)
      throw new NotFoundException("User doesn't exists in database");

    let cryptHelper = new BCryptHelper()
    let isPasswordMatch = await cryptHelper.compare(signInDto.password, user?.user_password)
    if (!isPasswordMatch)
      throw new UnauthorizedException();

    const payload = { sub: user.pk_id, username: user.email };
    return await this.jwtService.signAsync(payload);
  }
}