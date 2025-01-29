import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicle.controller';
import { VehiclesService } from './vehicle.service';
import { PrismaModule } from '../../prisma/prisma.module'; 
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule], 
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
