import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { AuthGuard } from '../../shared/guards/auth.guard';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
