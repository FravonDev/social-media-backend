import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCommentDto {
    @ApiProperty({ description: 'comment content', minLength: 1, maxLength: 1000 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1000)
    text: string;

    @ApiProperty({ description: 'comment ID' })
    @IsString()
    @IsNotEmpty()
    commentId: string;
}
