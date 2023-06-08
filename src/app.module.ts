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

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ImageUploadModule, ChatModule],
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
