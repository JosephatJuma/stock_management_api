import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  //create user
  async create(dto: any) {}
}
