import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(searchTerm: string, offset: number, limit: number) {
    const result: User[] = await this.prisma.$queryRaw(Prisma.sql`
    SELECT "id","name","username", "photo"
    FROM "User"
    WHERE LOWER("username") LIKE LOWER(${`%${searchTerm}%`})
    OR LOWER("name") LIKE ${`%${searchTerm}%`}
    ORDER BY "username" ASC
    OFFSET ${offset}
    LIMIT ${limit};
    `);
    return result;
  }
}
