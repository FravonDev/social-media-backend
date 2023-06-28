import { Injectable } from '@nestjs/common';
import { SearchDto } from './dto/search.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) { }

  async search(searchDto: SearchDto, offset: number, limit: number) {
    const { searchTerm } = searchDto
    const result: User[] = await this.prisma.$queryRaw(Prisma.sql`
    SELECT "name","username", "photo"
    FROM "User"
    WHERE LOWER("username") LIKE LOWER(${`%${searchTerm}%`})
    OR LOWER("name") LIKE ${`%${searchTerm}%`}
    ORDER BY "username" ASC
    OFFSET ${offset}
    LIMIT ${limit};
    `);
    return result
  }
}
