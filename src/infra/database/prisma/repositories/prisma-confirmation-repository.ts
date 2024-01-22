import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Follow } from '@/domain/app/entities/follow';
import { ConfirmationRepository } from '@/domain/app/repositories/confirmation-repository';
import { Confirmation } from '@/domain/app/entities/confirmation';
import { PrismaConfirmationMapper } from '../mappers/prisma-confirmation-mapper';

@Injectable()
export class PrismaConfirmationRepository implements ConfirmationRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmailAndCode(
    email: string,
    code: string,
  ): Promise<Confirmation | null> {
    const data = await this.prisma.confirmationCode.findFirst({
      where: {
        email,
        code,
      },
    });

    if (!data) {
      return null;
    }

    return PrismaConfirmationMapper.toDomain(data);
  }

  async create(confirmation: Confirmation): Promise<void> {
    const data = PrismaConfirmationMapper.toPrisma(confirmation);
    await this.prisma.confirmationCode.create({
      data,
    });
  }

  async save(confirmation: Confirmation): Promise<void> {
    const data = PrismaConfirmationMapper.toPrisma(confirmation);
    await this.prisma.confirmationCode.update({
      where: {
        id: confirmation.id.toString(),
      },
      data,
    });
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
