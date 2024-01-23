import { AppModule } from '@/app.module';
import { PrismaConfirmationMapper } from '@/infra/database/prisma/mappers/prisma-confirmation-mapper';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MakeConfirmation } from '@test/factories/make-confirmation';
import { makeUser } from '@test/factories/make-user';
import request from 'supertest';

describe('Send user email confirmation (E2E)', () => {
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

  test('[POST] /send-email-confirmation', async () => {
    const response = await request(app.getHttpServer())
      .post('/send-email-confirmation')
      .send({
        email: 'johndoe@example.com',
      });

    expect(response.statusCode).toBe(201);
    const userOnDatabase = await prisma.confirmationCode.findFirst({
      where: {
        email: 'johndoe@example.com',
      },
    });
    expect(userOnDatabase).toBeTruthy();
  });

  test('[POST] /send-email-confirmation with non-available email', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
    });

    const userData = PrismaUserMapper.toPrisma(user);

    await prisma.user.create({
      data: {
        ...userData,
        emailVerifiedAt: new Date(),
      },
    });

    const confirmation = MakeConfirmation({
      email: 'johndoe@example.com',
      code: '12345678',
    });

    const data = PrismaConfirmationMapper.toPrisma(confirmation);

    await prisma.confirmationCode.create({
      data,
    });

    const response = await request(app.getHttpServer())
      .post('/send-email-confirmation')
      .send({
        email: 'johndoe@example.com',
        code: '12345678',
      });

    expect(response.statusCode).toBe(409);
  });
});
