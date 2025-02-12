import { IsNumber, IsString } from 'class-validator';

export class VehicleResponseDto {
  @IsString()
  plate: string;

  @IsString()
  model: string;

  @IsString()
  brand: string;

  @IsString()
  color: string;

  @IsNumber()
  passengers: number;

}