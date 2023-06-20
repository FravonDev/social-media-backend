import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetComment {
    @ApiProperty({ description: 'post ID' })
    @IsUUID()
    @IsNotEmpty()
    postId: string;
}
