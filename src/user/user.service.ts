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
import { CheckUsernameDto } from './dto/check-username.dto';
import { UserDetails } from './interfaces/user.details';



@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

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

  async findByUsername(username: string) {
    try {
      return await this.prisma.user.findFirst({ where: { username } });
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
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.user.update({
      data: data,
      where: {
        id: userId,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }

  async checkUsernameIsAvailable(CheckUsername: CheckUsernameDto) {
    const { username } = CheckUsername;
    const existsUser: User[] = await this.prisma.$queryRaw(
      Prisma.sql`
        SELECT *
        FROM "User"
        WHERE LOWER("username") = LOWER(${username})
        `
    )
    if (existsUser.length < 1) {
      return false
    }

    return true

  }

  async getCurrentUser(user: User): Promise<UserDetails> {
    const { id } = user;

    const currentUser = await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        photo: true
      },
    });

    if (!currentUser) {
      throw new NotFoundException();
    }

    const userDetails: UserDetails = {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      photo: currentUser.photo
    };

    return userDetails;
  }

  async getUserDetails(userId: string): Promise<UserDetails> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException();
    }

    const userDetails: UserDetails = {
      id: user.id,
      name: user.name,
      username: user.username,
      photo: user.photo
    };
    return userDetails
  }
}
