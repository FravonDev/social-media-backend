import { AppModule } from '@/app.module';
import { PrismaConfirmationMapper } from '@/infra/database/prisma/mappers/prisma-confirmation-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MakeConfirmation } from '@test/factories/make-confirmation';
import request from 'supertest';
import { jest } from '@jest/globals';

describe('Send user email confirmation (E2E)', async () => {
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

  test('[POST] /confirm-email', async () => {
    const confirmation = MakeConfirmation({
      email: 'johndoe@example.com',
      code: '12345678',
    });

    const data = PrismaConfirmationMapper.toPrisma(confirmation);

    await prisma.confirmationCode.create({
      data: {
        ...data,
        ConfirmedAt: null,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/confirm-email')
      .send({
        email: 'johndoe@example.com',
        code: '12345678',
      });

    expect(response.statusCode).toBe(201);

    const confirmationCodeOnDatabase = await prisma.confirmationCode.findFirst({
      where: {
        email: 'johndoe@example.com',
      },
    });

    expect(confirmationCodeOnDatabase).toBeTruthy();
    expect(confirmationCodeOnDatabase!.ConfirmedAt).toBeInstanceOf(Date);
  });

  test('[POST] /confirm-email should not confirm with expired token', async () => {
    const confirmation = MakeConfirmation({
      email: 'test2@example.com',
      code: '12345678',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    });

    const data = PrismaConfirmationMapper.toPrisma(confirmation);

    await prisma.confirmationCode.create({
      data,
    });

    const response = await request(app.getHttpServer())
      .post('/confirm-email')
      .send({
        email: 'test2@example.com',
        code: '12345678',
      });

    expect(response.statusCode).toBe(401);

    const confirmationCodeOnDatabase = await prisma.confirmationCode.findFirst({
      where: {
        email: 'test2@example.com',
      },
    });

    expect(confirmationCodeOnDatabase).toBeTruthy();
    expect(confirmationCodeOnDatabase!.ConfirmedAt).toBeNull();
  });

  test('[POST] /confirm-email sound not confirm with invalid code', async () => {
    const confirmation = MakeConfirmation({
      email: 'johndoe@example.com',
      code: '12345678',
    });

    const data = PrismaConfirmationMapper.toPrisma(confirmation);

    await prisma.confirmationCode.create({
      data,
    });

    const response = await request(app.getHttpServer())
      .post('/confirm-email')
      .send({
        email: 'johndoe@example.com',
        code: '111111',
      });

    expect(response.statusCode).toBe(400);
  });
});
