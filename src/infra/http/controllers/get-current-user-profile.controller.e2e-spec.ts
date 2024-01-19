import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Get current user summary (E2E)', async () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] accounts/summary', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        password: await hash('12345678', 8),
        username: 'johndoe',
        name: 'John D.',
        photo: null,
        bio: null,
        emailVerifiedAt: new Date(),
      },
    });
    const access_token = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .get('/accounts/summary')
      .set('Authorization', `Bearer ${access_token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: user.id.toString(),
      username: user.username,
      name: user.name,
      photo: user.photo,
    });
  });
});
