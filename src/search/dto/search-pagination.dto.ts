import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsString, IsInt, Max, Min } from 'class-validator';

export class SearchPaginationParams {
  @IsInt()
  @IsDefined()
  @Min(0)
  @ApiProperty({
    description:
      'Offset value for pagination (number of users to skip in search)',
    minimum: 0,
  })
  @Type(() => Number)
  offset: number;

  @IsInt()
  @IsDefined()
  @Min(1)
  @Max(10)
  @ApiProperty({
    description:
      'Limit value for pagination (number of users to retrieve in search )',
    minimum: 1,
    maximum: 10,
  })
  @Type(() => Number)
  limit: number;

  @IsString()
  @ApiProperty({ description: 'The term (username or name) to search' })
  searchTerm: string;
}
