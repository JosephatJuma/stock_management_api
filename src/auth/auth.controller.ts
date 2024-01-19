import { Controller, Post,Body } from '@nestjs/common';
import { CreateUserDto,LoginUserDto } from 'src/users/dto/user.dto';
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
            password:{type:'string', example:'@2012TXPF'}
        }
    } })
    async login(@Body() dto: LoginUserDto) {
        return this.authService.loginUser(dto.userName, dto.password);
    }
}
