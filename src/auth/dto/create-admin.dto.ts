import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'Administrador' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@portal.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123456' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}