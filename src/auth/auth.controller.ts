import { Controller, Post,Body, Patch, Query } from '@nestjs/common';
import { CreateUserDto,LoginUserDto,ResetPasswordDto, ChangePasswordDto } from 'src/users/dto/user.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Create user account' })
    @ApiCreatedResponse({ type: CreateUserDto })
    @ApiBody({schema:{
        properties:{
            userName:{type:'string',example:'jameson'},
            password:{type:'string', example:'@2012TXPF'},
             companyId:{type:'string', example:"263673826392367289"},
             name:{type:'string', example:'James Onyango'},
             email:{type:'string', example:'jameson@gamil.com'}
        }
    } })
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUserAccount(createUserDto);
    }

    //login
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({schema:{
        properties:{
            userName:{type:'string',example:'jameson'},
            password:{type:'string', example:'@2012TXPF'},
            companyName:{type:'string', example:"Eden Pharmacy"}
        }
    } })
    async login(@Body() dto: LoginUserDto) {
        return this.authService.loginUser(dto.userName, dto.password,dto.companyName);
    }

    //requestn reset password
    @Post('forgot-password')
    @ApiOperation({ summary: 'Request reset password' })
    @ApiBody({schema:{
        properties:{
            email:{type:'string',example:'jameson@gamil.com'}
        }
    }})
    async forgotPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.requestResetPassword(dto.email);
    }

    //reset password
    @Patch('reset-password')
    @ApiOperation({ summary: 'Reset password' })
    @ApiBody({schema:{
        properties:{
            token:{type:'string',example:'jameson@gamil.com'},
            password:{type:'string', example:'@2012TXPF'}
        }
    }})
    async resetPassword(@Body() dto: ChangePasswordDto) {
        return this.authService.resetPassword(dto.token, dto.password);
    }

}
