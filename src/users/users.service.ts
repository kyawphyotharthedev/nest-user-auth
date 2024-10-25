import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Users } from '@prisma/client';
import { UserDto } from './dto';
import { simpleHandleCatch } from 'src/utilities/exception';
import { SuccessResponse } from 'src/common/type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async hash_password(ps: string): Promise<string> {
    return await argon.hash(ps);
  }

  async find_user_by_id(user_id: number): Promise<Users | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });
    return user;
  }

  async find_user_by_email(email: string): Promise<Users | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async create_user(userDto: UserDto): Promise<Users> {
    const user = await this.find_user_by_email(userDto.email);

    if (user)
      throw new HttpException('Email already exist.', HttpStatus.BAD_REQUEST);

    try {
      const new_user = await this.prisma.users.create({
        data: {
          ...userDto,
          password: await this.hash_password(userDto.password),
        },
      });
      return new_user;
    } catch (e) {
      simpleHandleCatch(e);
    }
  }

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async update_user(
    user_id: number,
    userDto: UserDto,
  ): Promise<SuccessResponse> {
    const user = await this.find_user_by_id(user_id);
    if (user.email !== userDto.email) {
      const ser_user = await this.find_user_by_email(userDto.email);
      if (ser_user)
        throw new HttpException('Email already exist.', HttpStatus.NOT_FOUND);
    }

    try {
      await this.prisma.users.update({
        where: {
          id: user_id,
        },
        data: {
          ...userDto,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully.',
      };
    } catch (e) {
      simpleHandleCatch(e);
    }
  }

  async remove(id: number): Promise<Users> {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
