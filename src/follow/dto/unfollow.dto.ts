
import { IsString, MaxLength, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnfollowDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'ID of the user being unfollowed' })
    username: string;
}
