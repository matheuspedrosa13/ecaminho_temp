import { IsNotEmpty, IsString, IsInt, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  brand: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  model: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  color: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  plate: string;

  @IsNotEmpty()
  @IsInt()
  passengers: number;

  @IsNotEmpty()
  @IsInt()
  token: string;
}
