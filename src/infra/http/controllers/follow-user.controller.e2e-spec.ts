import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Follow user (E2E)', () => {
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

  test('[POST] /follow', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        password: await hash('12345678', 8),
        username: 'johndoe',
        name: 'John D.',
        photo: null,
        bio: null,
      },
    });
    const access_token = jwt.sign({ sub: user.id });

    await prisma.user.create({
      data: {
        email: 'sarahs@example.com',
        password: await hash('12345678', 8),
        username: 'sarahs',
        name: 'sarah S.',
        photo: null,
        bio: null,
      },
    });

    const responseFollow = await request(app.getHttpServer())
      .post('/follow')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ username: 'sarahs' });

    expect(responseFollow.statusCode).toBe(201);
  });

  test('[POST] /follow - Already Following', async () => {
    const user = await prisma.user.findFirst({
      where: {
        username: 'johndoe',
      },
    });
    if (!user) {
      fail('Current User not found.');
    }

    const access_token = jwt.sign({ sub: user.id });

    const responseFollow = await request(app.getHttpServer())
      .post('/follow')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ username: 'sarahs' });
    expect(responseFollow.statusCode).toBe(409);
    expect(responseFollow.body.message).toEqual('Already following this user.');
  });
});
