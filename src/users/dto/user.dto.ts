import { ApiProperty } from '@nestjs/swagger';
import { UsersRole } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsEnum(UsersRole)
  @IsNotEmpty()
  role: UsersRole;
}

export class InternalProfileDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(UsersRole)
  @IsNotEmpty()
  role: UsersRole;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  old_password: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}
