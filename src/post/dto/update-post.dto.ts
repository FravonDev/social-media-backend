import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @ApiProperty({ description: 'Post Id' })
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
