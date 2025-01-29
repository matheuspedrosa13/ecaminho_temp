import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { VehiclesService } from './vehicle.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';
import { SkipAuth } from 'src/constants';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';


@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) : Promise<HttpResponse<boolean>>{
    const userReq = req.user;
    await this.vehiclesService.create(createVehicleDto, userReq.id);
    const response: HttpResponse<boolean> = {
      data: true,
      message: "Vehicle created successfully"
    }
    return response
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
