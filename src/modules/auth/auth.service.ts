import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.intity';

@Injectable()
export class AuthService {
  constructor(
    private usersSerivce: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const exists = await this.usersSerivce.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already used');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersSerivce.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: passwordHash,
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersSerivce.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
