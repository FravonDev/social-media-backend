import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateLikeDto {
    @ApiProperty({ description: 'Post ID' })
    @IsString()
    postId: string;
}
