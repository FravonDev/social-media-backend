import { Module } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { CommentLikeController } from './comment-like.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentModule } from 'src/comment/comment.module';
import { CommentService } from 'src/comment/comment.service';
import { PostModule } from 'src/post/post.module';
import { PostService } from 'src/post/post.service';

@Module({
  imports: [PrismaModule, CommentModule, PostModule],
  controllers: [CommentLikeController],
  providers: [CommentLikeService, CommentService, PostService]
})
export class CommentLikeModule {}
