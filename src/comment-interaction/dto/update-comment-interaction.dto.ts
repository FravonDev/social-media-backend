import { PartialType } from '@nestjs/swagger';
import { CreateCommentInteractionDto } from './create-comment-interaction.dto';

export class UpdateCommentInteractionDto extends PartialType(CreateCommentInteractionDto) {}
