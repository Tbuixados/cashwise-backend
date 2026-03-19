import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  //Trae categorias globales + creadas por el usuario
  async findAll(user: User) {
    return this.categoryRepo.find({
      where: [{ user: { id: user.id } }, { user: IsNull() }],
      order: { name: 'ASC' },
    });
  }
}
