import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{access_token: string}> {
    const user = await this.userService.getUserByEmail(username);
    if (user?.user_password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.pk_id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}