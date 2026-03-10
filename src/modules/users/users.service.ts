import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.intity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) //Nest inyecta automáticamente el repository de TypeORM.
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordhash = await bcrypt.hash(createUserDto.password, 10); //10 = saltRounds = costFactor = + alto + seguro + lento

    //Crea la instancia de la entidad.
    const user = this.userRepository.create({
      email: createUserDto.email,
      passwordHash: passwordhash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });
    return this.userRepository.save(user); //Inserta en Postgres.
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
