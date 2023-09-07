import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Max, Min } from 'class-validator';

export class GetUserPostsQuery {
  @IsInt()
  @IsDefined()
  @Min(0)
  @ApiProperty({
    description: 'Offset value for pagination (number of posts to skip)',
    minimum: 0,
  })
  @Type(() => Number)
  offset: number;

  @IsInt()
  @IsDefined()
  @Min(1)
  @Max(50)
  @ApiProperty({
    description: 'Limit value for pagination (number of posts to retrieve)',
    minimum: 1,
    maximum: 50,
  })
  @Type(() => Number)
  limit: number;
}
