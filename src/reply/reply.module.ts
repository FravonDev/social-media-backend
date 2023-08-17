import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentModule } from 'src/comment/comment.module';
import { CommentService } from 'src/comment/comment.service';
import { PostService } from 'src/post/post.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, CommentModule, UserModule],
  controllers: [ReplyController],
  providers: [ReplyService, CommentService, PostService]
})
export class ReplyModule { }
