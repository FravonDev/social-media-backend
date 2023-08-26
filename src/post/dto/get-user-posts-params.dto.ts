import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserPostsParam {
  @ApiProperty({ description: 'username' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
