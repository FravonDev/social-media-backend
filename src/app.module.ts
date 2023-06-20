import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { ChatModule } from './chat/chat.module';
import { FollowModule } from './follow/follow.module';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { CommentInteractionModule } from './comment-interaction/comment-interaction.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ImageUploadModule, ChatModule, FollowModule, PostModule, LikeModule, CommentModule, CommentInteractionModule],
  controllers: [AppController],
  providers: [
    AppService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
