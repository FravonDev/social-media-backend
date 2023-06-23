import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class ReplyLikeDto {
    @ApiProperty({ description: 'Comment ID' })
    @IsUUID()
    @IsNotEmpty()
    replyId: string;
}
