import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateReplyDto {
    @ApiProperty({ description: 'reply content', minLength: 1, maxLength: 1000 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1000)
    text: string;

    @ApiProperty({ description: 'Comment ID' })
    @IsUUID()
    @IsNotEmpty()
    commentId: string;
}
