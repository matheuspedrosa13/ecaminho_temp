import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';
import { VehicleResponseDto } from './dto/vehicleresponse.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto, userId: number): Promise<VehicleResponseDto> {
    const plate = await this.prisma.eca_vehicles.findUnique({
      where: { plate: createVehicleDto.plate },
    });
    if (plate) 
      throw new HttpException("plate already exists", HttpStatus.CONFLICT);
    const result = await this.prisma.eca_vehicles.create({
      data: createVehicleDto,
    });
    await this.prisma.eca_users.update({
      where: { pk_id: userId },
      data: { pfk_eca_vehicles_id: result.pk_id }
    });
    return {
      plate: createVehicleDto.plate,
      model: createVehicleDto.model,
      brand: createVehicleDto.brand,
      color: createVehicleDto.color,
      passenger: createVehicleDto.passengers
    };
  }

  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.prisma.eca_vehicles.findMany({
      include: { eca_users: true }, 
    });
    return vehicles.map(vehicle => ({
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      color: vehicle.color,
      passenger: vehicle.passengers
    }));
  }

  async findOne(id: number): Promise<VehicleResponseDto> {
    const vehicle = await this.prisma.eca_vehicles.findUnique({
      where: { pk_id: id },
      include: { eca_users: true }, 
    });
    if (!vehicle) 
      throw new NotFoundException(`${id} not found`);
    return {
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      color: vehicle.color,
      passenger: vehicle.passengers
    };
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<VehicleResponseDto> {
    await this.findOne(id); 
    const updatedVehicle = await this.prisma.eca_vehicles.update({
      where: { pk_id: id },
      data: updateVehicleDto,
    });
    return {
      plate: updatedVehicle.plate,
      model: updatedVehicle.model,
      brand: updatedVehicle.brand,
      color: updatedVehicle.color,
      passenger: updatedVehicle.passengers
    };
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.findOne(id); 
      await this.prisma.eca_vehicles.delete({
        where: { pk_id: id },
      });
      return true;
    } catch (error) {
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
