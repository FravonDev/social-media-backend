import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
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

    console.log(response);
    expect(response.statusCode).toBe(201);
    const userOnDatabase = await prisma.confirmationCode.findFirst({
      where: {
        email: 'johndoe@example.com',
      },
    });
    expect(userOnDatabase).toBeTruthy();
  });
});
