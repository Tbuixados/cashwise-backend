import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // Data Transfer Object Define cómo debe venir el request.
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
