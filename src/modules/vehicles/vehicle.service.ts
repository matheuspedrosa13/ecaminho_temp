import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';
import { eca_vehicles as Vehicle } from '@prisma/client'; 

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto, userId: number): Promise<Vehicle> {
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

    return result;
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.prisma.eca_vehicles.findMany({
      include: { eca_users: true }, 
    });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.prisma.eca_vehicles.findUnique({
      where: { pk_id: id },
      include: { eca_users: true }, 
    });

    if (!vehicle) 
      throw new NotFoundException(`${id} not found`);

    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    await this.findOne(id); 
    return await this.prisma.eca_vehicles.update({
      where: { pk_id: id },
      data: updateVehicleDto,
    });
  }

  async remove(id: number): Promise<Vehicle> {
    await this.findOne(id); 
    return await this.prisma.eca_vehicles.delete({
      where: { pk_id: id },
    });
  }
}
