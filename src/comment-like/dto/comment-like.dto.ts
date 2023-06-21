import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CommentLikeDto {
    @ApiProperty({ description: 'Comment ID' })
    @IsUUID()
    @IsNotEmpty()
    commentId: string;
}
