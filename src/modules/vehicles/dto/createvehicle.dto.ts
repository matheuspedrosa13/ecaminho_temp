import { IsNotEmpty, IsString, IsInt, MaxLength, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: "Vehicle's brand",
    example: 'Honda'
  })
  brand: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: "Vehicle's model",
    example: 'Civic'
  })
  model: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: "Vehicle's color",
    example: 'Preto'
  })
  color: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @ApiProperty({
    description: "Vehicle's plate",
    example: 'ABC1234'
  })
  plate: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: "Vehicle's passengers quantity",
    example: '4'
  })
  passengers: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) 
  stops: string[];
}
