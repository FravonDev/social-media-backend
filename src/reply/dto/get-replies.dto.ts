import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetReplies {
    @ApiProperty({ description: 'comment ID' })
    @IsUUID()
    @IsNotEmpty()
    commentId: string;
}
