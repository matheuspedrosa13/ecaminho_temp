import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto, userId: number) {
    const result = await this.prisma.eca_vehicles.create({
      data: createVehicleDto,
    });
    this.prisma.eca_users.update({where: {pk_id : userId}, data: {pfk_eca_vehicles_id : result.pk_id}} )
  }

  async findAll() {
    return await this.prisma.eca_vehicles.findMany({
      include: { eca_users: true }, 
    });
  }

  async findOne(id: number) {
    const vehicle = await this.prisma.eca_vehicles.findUnique({
      where: { pk_id: id },
      include: { eca_users: true }, 
    });
    if (!vehicle) {
      throw new NotFoundException(`${id} not found`);
    }
    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id); 
    return await this.prisma.eca_vehicles.update({
      where: { pk_id: id },
      data: updateVehicleDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return await this.prisma.eca_vehicles.delete({
      where: { pk_id: id },
    });
  }
}
