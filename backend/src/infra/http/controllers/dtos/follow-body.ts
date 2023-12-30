import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FollowUserBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Username of the user being followed' })
  username: string;
}
