import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ description: 'comment content', minLength: 1, maxLength: 1000 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1000)
    text: string;

    @ApiProperty({ description: 'Post ID' })
    @IsUUID()
    @IsNotEmpty()
    postId: string;
}
