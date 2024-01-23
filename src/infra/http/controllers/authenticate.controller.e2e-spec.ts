import { AppModule } from '@/app.module';
import { WrongCredentialsError } from '@/domain/app/use-cases/auth/errors/wrong-credentials-error';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
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

  test('[POST] accounts/login', async () => {
    await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        password: await hash('12345678', 8),
        username: 'johndoe',
        name: 'John Doe',
        photo: null,
        bio: null,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/accounts/login')
      .send({
        email: 'johndoe@example.com',
        password: '12345678',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });

  test('[POST] accounts/login - WrongCredentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts/login')
      .send({
        email: 'wrongemail@example.com',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Credentials are not valid.');
  });
});
