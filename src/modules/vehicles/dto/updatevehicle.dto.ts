import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './createvehicle.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
