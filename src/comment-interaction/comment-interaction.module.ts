import { Module } from '@nestjs/common';
import { CommentInteractionService } from './comment-interaction.service';
import { CommentInteractionController } from './comment-interaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentInteractionController],
  providers: [CommentInteractionService]
})
export class CommentInteractionModule {}
