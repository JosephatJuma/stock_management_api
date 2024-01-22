import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { JwtTokenService } from './jwt-token/jwt-token.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private jwt: JwtTokenService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  //create user account
  async createUserAccount(dto: CreateUserDto): Promise<any> {
    await this.findUserName(dto.userName);
    await this.findEmail(dto.email);
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
        email: { create: { emailAddress: dto.email } },
      },
    });
    await this.mail.sendMail(
      dto.email,
      'Welcome to Kuuza',
      { name: user.name },
      'welcome.hbs',
    );
    const tokens = await this.jwt.signTokens(
      user.id,
      user.userName,
      hashedPassword,
    );
    return { message: 'User created successfully', user, tokens };
  }

  //email exists
  private async findEmail(email: string): Promise<any> {
    const emailExists = await this.prisma.email.findFirst({
      where: { emailAddress: email },
    });
    if (emailExists) {
      throw new ConflictException('Email is already registered');
    }
  }

  private async findUserName(userName: string): Promise<any> {
    const userExists = await this.prisma.user.findFirst({
      where: { userName: userName },
    });
    if (userExists) {
      throw new ConflictException('Username is already taken');
    }
  }
  //login user
  async loginUser(
    userName: string,
    password: string,
    companyName: string,
  ): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { userName: userName, company: { name: companyName } },
      include: {
        password: true,
        email: { select: { emailAddress: true } },
        company: { include: { admin: true } },
      },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'Invalid username or company name',
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
    } else {
      const tokens = await this.jwt.signTokens(
        user.id,
        user.userName,
        user.password.hash,
      );
      delete user.password;
      return { message: 'Login Successful', tokens, user };
    }
  }

  private async createHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt); // Hash the password with the salt
  }

  //request reset password
  async requestResetPassword(email: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email: { emailAddress: email } },
    });
    if (!user) {
      throw new HttpException(
        {
          message: 'Email is not registered',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: token,
      },
    });
    const url = `${this.config.get('BASE_URL')}/auth/reset/${token}`;
    await this.mail.sendMail(
      email,
      'Reset Password',
      { url, name: user.name },
      'reset-password.hbs',
    );
    return { message: `Password reset link sent to your email ${email}` };
  }

  //reset password
  async resetPassword(token: string, password: string): Promise<any> {
    const tokenExists = await this.prisma.token.findFirst({
      where: { token: token },
      include: { user: true },
    });
    if (!tokenExists) {
      throw new HttpException(
        {
          message: 'Invalid token',
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await this.createHash(password, salt);

    const newPassword = await this.prisma.password.update({
      where: { userId: tokenExists.user.id },
      data: { salt, hash: hashedPassword, updatedAt: new Date() },
    });

    return { message: 'Password reset successfully' };
  }
}
