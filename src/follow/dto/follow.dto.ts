
import { IsString, MaxLength, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Username of the user being followed' })
    username: string;
}
