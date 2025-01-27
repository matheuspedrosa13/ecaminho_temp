import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehiclesService } from './vehicle.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';
import { SkipAuth } from 'src/constants';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @SkipAuth()
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return await this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @SkipAuth()
  async findAll() {
    return await this.vehiclesService.findAll();
  }

  @Get(':id')
  @SkipAuth()
  async findOne(@Param('id') id: number) {
    return await this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @SkipAuth()
  async update(@Param('id') id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
    return await this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @SkipAuth()
  async remove(@Param('id') id: number) {
    return await this.vehiclesService.remove(id);
  }
}
