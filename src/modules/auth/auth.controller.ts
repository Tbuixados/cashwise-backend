import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<User> {
    const user = await this.authService.register(dto);
    return plainToInstance(User, user); // passwordHash ya no se devuelve
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: User }) {
    return plainToInstance(User, req.user); // ahora devuelve todo el usuario completo
  }
}

///passwordHash no se incluye en la respuesta JSON
//Todavía está en la DB para login y JWT
//Mantienes seguridad y buenas prácticas
