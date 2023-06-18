import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetComment {
    @ApiProperty({ description: 'post ID' })
    @IsString()
    @IsNotEmpty()
    postId: string;
}
