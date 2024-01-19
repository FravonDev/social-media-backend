import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { UsersRepository } from '@/app/repositories/users-repository';
import { User } from '@/app/entities/user';
import { User as PrismaUser, Prisma } from '@prisma/client';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        token,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findManyUsersWithPagination(
    query: string,
    offset: number,
    limit: number,
  ) {
    const queryResults: PrismaUser[] = await this.prisma.$queryRaw(Prisma.sql`
    SELECT user
    FROM "User"
    WHERE LOWER("username") LIKE LOWER(${`%${query}%`})
    OR LOWER("name") LIKE ${`%${query}%`}
    ORDER BY "username" ASC
    OFFSET ${offset}
    LIMIT ${limit};
    `);

    const results = queryResults.map(PrismaUserMapper.toDomainSummary);

    return results;
  }

  async findConfirmedById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        emailVerifiedAt: {
          not: null,
        },
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findConfirmedByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
        emailVerifiedAt: {
          not: null,
        },
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findConfirmedByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        emailVerifiedAt: {
          not: null,
        },
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }
}
