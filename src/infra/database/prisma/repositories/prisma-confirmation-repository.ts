import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Follow } from '@/domain/app/entities/follow';
import { PrismaFollowMapper } from '../mappers/prisma-follows-mapper';
import { ConfirmationRepository } from '@/domain/app/repositories/confirmation-repository';
import { Confirmation } from '@/domain/app/entities/confirmation';
import { PrismaConfirmationMapper } from '../mappers/prisma-confirmation-mapper';

@Injectable()
export class PrismaConfirmationRepository implements ConfirmationRepository {
  constructor(private prisma: PrismaService) {}

  async create(confirmation: Confirmation): Promise<void> {
    const data = PrismaConfirmationMapper.toPrisma(confirmation);
    await this.prisma.confirmationCode.create({
      data,
    });
  }
  async save(confirmation: Confirmation): Promise<void> {
    const data = PrismaConfirmationMapper.toPrisma(confirmation);
    await this.prisma.confirmationCode.create({ data });
  }

  async delete(follow: Follow): Promise<void> {
    await this.prisma.follow.delete({
      where: {
        id: follow.id.toString(),
      },
    });

    return;
  }
}
