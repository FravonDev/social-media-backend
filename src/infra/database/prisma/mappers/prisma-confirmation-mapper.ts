import {
  ConfirmationCode as rawConfirmationCode,
  Prisma,
} from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Follow } from '@/domain/app/entities/follow';
import { Confirmation } from '@/domain/app/entities/confirmation';

export class PrismaConfirmationMapper {
  static toDomain(raw: rawConfirmationCode): Confirmation {
    return Confirmation.create(
      {
        email: raw.email,
        code: raw.code,
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
        ConfirmedAt: raw.ConfirmedAt || undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    follow: Confirmation,
  ): Prisma.ConfirmationCodeUncheckedCreateInput {
    return {
      id: follow.id.toString(),
      email: follow.email,
      code: follow.code,
      expiresAt: follow.expiresAt,
      createdAt: follow.createdAt,
      ConfirmedAt: follow.ConfirmedAt || undefined,
    };
  }
}
