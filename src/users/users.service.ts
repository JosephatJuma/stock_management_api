import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  //create user
  async create(dto: CreateUserDto) {
    // const user = await this.prisma.user.create({ data: dto });
    // return user;
  }
}
