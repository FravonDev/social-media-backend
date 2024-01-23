import { faker } from '@faker-js/faker';

import { User, UserProps } from '@/domain/app/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      photo: null,
      bio: faker.lorem.paragraph({ min: 0, max: 180 }),
      createdAt: new Date(),
      emailVerifiedAt: null,
      updatedAt: null,
      deletedAt: null,
      ...override,
    },
    id,
  );

  return user;
}
