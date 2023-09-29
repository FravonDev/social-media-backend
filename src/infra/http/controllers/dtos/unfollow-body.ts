import { IsString, MaxLength, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnfollowUserBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Username of the user being unfollowed' })
  username: string;
}
