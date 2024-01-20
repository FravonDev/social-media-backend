import { AppModule } from '@/app.module';
import { User } from '@/domain/app/entities/user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeUser } from '@test/factories/make-user';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Confirm Account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[GET] /accounts/confirm-email', async () => {
    const userProps = makeUser({
      email: 'johndoe@example.com',
      password: await hash('12345678', 8),
    });

    const domainUser = User.create(userProps);

    const user = PrismaUserMapper.toPrisma(domainUser);

    const token = user.token as string;

    await prisma.user.create({
      data: user,
    });

    const response = await request(app.getHttpServer()).get(
      `/accounts/confirm?token=${token}`,
    );

    expect(response.statusCode).toBe(200);
    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
