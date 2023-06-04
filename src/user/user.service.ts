import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      id: uuid(),
    };

    try {
      const createdUser = await this.prisma.user.create({ data });
      return {
        ...createdUser,
        password: undefined,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta.target.includes('email')) {
          throw new ConflictException('email already exists');
        } else if (error.meta.target.includes('username')) {
          throw new ConflictException('username already exists');
        }
      }
      throw error;
    }
  }
  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findFirst({ where: { email } });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findId(userId: string) {
    try {
      return await this.prisma.user.findFirst({ where: { id: userId } });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(userId, data: UpdateUserDto) {
    const userExists = await this.findId(userId);
    if (!userExists){
      throw new NotFoundException('User not found');
    }

    return await this.prisma.user.update({
      data: data,
      where: {
        id: userId,
      },
    });
  }
}
