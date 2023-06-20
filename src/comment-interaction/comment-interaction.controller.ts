import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentInteractionService } from './comment-interaction.service';
import { CreateCommentInteractionDto } from './dto/create-comment-interaction.dto';
import { UpdateCommentInteractionDto } from './dto/update-comment-interaction.dto';

@Controller('comment')
export class CommentInteractionController {
  constructor(private readonly commentInteractionService: CommentInteractionService) {}

  @Post()
  createCommentLike(@Body() createCommentInteractionDto: CreateCommentInteractionDto) {
    return this.commentInteractionService.create(createCommentInteractionDto);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentInteractionService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.commentInteractionService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentInteractionDto: UpdateCommentInteractionDto) {
    return this.commentInteractionService.update(+id, updateCommentInteractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentInteractionService.remove(+id);
  }
}
