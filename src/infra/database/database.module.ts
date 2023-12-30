import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@/app/repositories/users-repository';
import { FollowsRepository } from '@/app/repositories/follows-repository';
import { PrismaFollowsRepository } from './prisma/repositories/prisma-follows-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: FollowsRepository,
      useClass: PrismaFollowsRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, FollowsRepository],
})
export class DatabaseModule {}
