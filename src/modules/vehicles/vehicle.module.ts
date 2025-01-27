import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicle.controller';
import { VehiclesService } from './vehicle.service';
import { PrismaModule } from '../../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
