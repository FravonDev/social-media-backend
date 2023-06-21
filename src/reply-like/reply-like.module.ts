import { Module } from '@nestjs/common';
import { ReplyLikeService } from './reply-like.service';
import { ReplyLikeController } from './reply-like.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReplyLikeController],
  providers: [ReplyLikeService]
})
export class ReplyLikeModule {}
