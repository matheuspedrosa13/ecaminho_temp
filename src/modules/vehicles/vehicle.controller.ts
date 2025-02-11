import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpException, HttpStatus } from '@nestjs/common';
import { VehiclesService } from './vehicle.service';
import { CreateVehicleDto } from './dto/createvehicle.dto';
import { UpdateVehicleDto } from './dto/updatevehicle.dto';
import { HttpResponse } from 'src/shared/interfaces/http-response.interface';
import { VehicleResponseDto } from './dto/vehicleresponse.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

@Post()
@ApiTags('vehicle')
@ApiResponse({ status: 200, description: "Creates a vehicle and updates user that sent requisition" })
@ApiResponse({ status: 409, description: 'Plate already exists.' })
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
      error: 'error creating vehicle',
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

 @Get()
 @ApiTags('vehicle')
 @ApiResponse({status: 200})
 async findAll(): Promise<HttpResponse<VehicleResponseDto[]>> {
  const vehicles = await this.vehiclesService.findAll();
    
    const response = vehicles.map(vehicle => ({
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      color: vehicle.color,
      passengers: vehicle.passengers
    }));

    return {
      data: response,
      message: "success"
    };
}

@Get(':id')
@ApiTags('vehicle')
@ApiResponse({ status: 200 })
@ApiResponse({ status: 404, description: "Vehicle ID not found" })
async findOne(@Param('id') id: number): Promise<HttpResponse<VehicleResponseDto>> {
  const vehicle = await this.vehiclesService.findOne(id);
  const response: VehicleResponseDto = {
    plate: vehicle.plate,
    model: vehicle.model,
    brand: vehicle.brand,
    color: vehicle.color,
    passengers: vehicle.passengers,
  };
  return {
    data: response,
    message: "success"
  };
}


@Patch(':id')
@ApiTags('vehicle')
@ApiResponse({ status: 200 })
async update(@Param('id') id: number, @Body() updateVehicleDto: UpdateVehicleDto): Promise<HttpResponse<VehicleResponseDto>> {
  const updatedVehicle = await this.vehiclesService.update(id, updateVehicleDto);
  const response: VehicleResponseDto = {
    plate: updatedVehicle.plate,
    model: updatedVehicle.model,
    brand: updatedVehicle.brand,
    color: updatedVehicle.color,
    passengers: updatedVehicle.passengers,
  };
  return {
    data: response,
    message: "success"
  };
}


  @Delete(':id')
  @ApiTags('vehicle')
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: number) : Promise<HttpResponse<boolean>>{
    await this.vehiclesService.remove(id);
    const response: HttpResponse<boolean> = {
      data: true,
      message: "success"
    }
    return response
  }
}
