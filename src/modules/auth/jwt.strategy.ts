import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.intity';

interface JwtPayload {
  sub: string; // userId
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //toma el token del header Authorization: Bearer TOKEN
      ignoreExpiration: false, //no permite tokens expirados
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    //devuelve lo que será req.user
    // payload es lo que pusiste en login: { sub: user.id, email: user.email }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
