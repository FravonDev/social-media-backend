import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class CommentPaginationParams {
    @IsInt()
    @IsDefined()
    @Min(0)
    @ApiProperty({
        description: 'Offset value for pagination (number of comments to skip)',
        minimum: 0
    })
    @Type(() => Number)
    offset: number;

    @IsInt()
    @IsDefined()
    @Min(1)
    @Max(20)
    @ApiProperty({
        description: 'Limit value for pagination (number of comments to retrieve)',
        minimum: 1,
        maximum: 20,
    })
    @Type(() => Number)
    limit: number;

    @ApiProperty({ description: 'post ID' })
    @IsUUID()
    @IsNotEmpty()
    postId: string;
}
