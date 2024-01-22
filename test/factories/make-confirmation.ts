import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Confirmation,
  ConfirmationProps,
} from '@/domain/app/entities/confirmation';

export function MakeConfirmation(
  override: Partial<ConfirmationProps> = {},
  id?: UniqueEntityID,
) {
  const confirmation = Confirmation.create(
    {
      code: String(faker.number.int({ min: 100000, max: 999999 })),
      email: faker.internet.email(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      ...override,
    },
    id,
  );

  return confirmation;
}
