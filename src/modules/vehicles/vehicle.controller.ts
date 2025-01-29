import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehiclesService } from './vehicle.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';
import { SkipAuth } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import { HttpResponse } from '../../shared/interfaces/http-response.interface';


@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService, private jwtService: JwtService) {}

  @Post()
  @SkipAuth()
  async create(@Body() createVehicleDto: CreateVehicleDto) {

    const token = createVehicleDto.token;
    const decodedToken = this.jwtService.verify(token);
    let userId: number;
    userId = decodedToken.sub;
    return await this.vehiclesService.create(createVehicleDto, userId);
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
