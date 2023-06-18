import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCommentDto {
    @ApiProperty({ description: 'comment ID' })
    @IsString()
    @IsNotEmpty()
    commentId: string;
}
