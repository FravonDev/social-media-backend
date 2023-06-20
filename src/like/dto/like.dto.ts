import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateLikeDto {
    @ApiProperty({ description: 'Post ID' })
    @IsUUID()
    @IsNotEmpty()
    postId: string;
}
