import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { JwtTokenService } from './jwt-token/jwt-token.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private jwt: JwtTokenService,
  ) {}

  //create user account
  async createUserAccount(dto: CreateUserDto): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await this.createHash(dto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        userName: dto.userName,
        companyId: dto.companyId,
        password: {
          create: { hash: hashedPassword, salt: salt },
        },
      },
    });
    return { message: 'User created successfully' };
  }

  //login user
  async loginUser(userName: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { userName: userName },
      include: { password: true },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'Invalid username',
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password.hash);

    if (!isPasswordValid) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    else{
      const tokens = await this.jwt.signTokens(user.id, user.userName, user.password.hash);
      return { message:"Login Successful", tokens, user };
    }

    
  }

  private async createHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt); // Hash the password with the salt
  }
}
