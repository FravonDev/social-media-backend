import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Unfollow user (E2E)', () => {
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

  test('[POST] /unfollow', async () => {
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

    await prisma.follow.create({
      data: {
        followerId: john.id,
        followedId: sarah.id,
        createdAt: new Date(),
      },
    });

    const responseUnfollow = await request(app.getHttpServer())
      .delete('/unfollow')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ username: 'sarahs' });

    expect(responseUnfollow.statusCode).toBe(200);
  });

  test('[POST] /unfollow - not Following', async () => {
    const john = await prisma.user.findFirst({
      where: {
        username: 'johndoe',
      },
    });

    if (!john) {
      fail('Current User not found.');
    }

    const access_token = jwt.sign({ sub: john.id });

    const responseFollow = await request(app.getHttpServer())
      .delete('/unfollow')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ username: 'sarahs' });
    expect(responseFollow.statusCode).toBe(404);
    expect(responseFollow.body.message).toEqual('Not following this user.');
  });
});
