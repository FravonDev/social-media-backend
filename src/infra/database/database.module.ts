import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { FollowsRepository } from '@/domain/app/repositories/follows-repository';
import { PrismaFollowsRepository } from './prisma/repositories/prisma-follows-repository';
import { ConfirmationRepository } from '@/domain/app/repositories/confirmation-repository';
import { PrismaConfirmationRepository } from './prisma/repositories/prisma-confirmation-repository';

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
    {
      provide: ConfirmationRepository,
      useClass: PrismaConfirmationRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    FollowsRepository,
    ConfirmationRepository,
  ],
})
export class DatabaseModule {}
