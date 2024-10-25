import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async create_user(@Body() useDto: UserDto) {
    return this.userService.create_user(useDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async get_all_user() {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get_user_by_id(@Param('id') id: string) {
    return this.userService.find_user_by_id(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update_user_by_id(@Param('id') id: string, @Body() useDto: UserDto) {
    return this.userService.update_user(+id, useDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete_user_by_id(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
