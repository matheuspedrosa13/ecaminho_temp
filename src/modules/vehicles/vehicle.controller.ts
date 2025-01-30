import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpException, HttpStatus } from '@nestjs/common';
import { VehiclesService } from './vehicle.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';
import { eca_vehicles as Vehicle } from '@prisma/client'; 



@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
async create(@Body() createVehicleDto: CreateVehicleDto, @Request() req): Promise<HttpResponse<boolean>> {
  const userReq = req.user;
  try {
    await this.vehiclesService.create(createVehicleDto, userReq.id);
    
    return {
      data: true,
      message: "vehicle created successfully",
    };
  } catch (error) {
    if (error.response) {
      throw new HttpException(error.response, HttpStatus.CONFLICT);
    }
    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Error creating vehicle',
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

 @Get()
async findAll(): Promise<HttpResponse<Vehicle[]>> {
  const result = await this.vehiclesService.findAll();
  const response: HttpResponse<Vehicle[]> = { 
    data: result,
    message: "success"
  };
  return response;
}

  @Get(':id')
  async findOne(@Param('id') id: number) : Promise<HttpResponse<Vehicle>>{
    const result = await this.vehiclesService.findOne(id);
    const response: HttpResponse<Vehicle> = {
      data: result,
      message: "success"
    }
    return response
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateVehicleDto: UpdateVehicleDto) : Promise<HttpResponse<Vehicle>>{
    const result = await this.vehiclesService.update(id, updateVehicleDto);
    const response: HttpResponse<Vehicle> = {
      data: result,
      message: "success"
    }
    return response
  }

  @Delete(':id')
  async remove(@Param('id') id: number) : Promise<HttpResponse<boolean>>{
    await this.vehiclesService.remove(id);
    const response: HttpResponse<boolean> = {
      data: true,
      message: "success"
    }
    return response
  }
}
