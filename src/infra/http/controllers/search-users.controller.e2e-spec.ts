import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import { User, UserSummary } from '@/domain/app/entities/user';

describe('Search users (E2E)', () => {
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

  test('[GET] /search/users', async () => {
    const john = await prisma.user.create({
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

    const access_token = jwt.sign({ sub: john.id });

    const sarah = await prisma.user.create({
      data: {
        email: 'sarahs@example.com',
        password: await hash('12345678', 8),
        username: 'sarahs',
        name: 'sarah S.',
        photo: null,
        bio: null,
        emailVerifiedAt: new Date(),
      },
    });

    const response = await request(app.getHttpServer())
      .get('/search/users')
      .set('Authorization', `Bearer ${access_token}`)
      .query({ query: 'sarah' });

    expect(response.status).toBe(200);
  });
});
