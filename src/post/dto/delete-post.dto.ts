import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePostDto {
    @IsString()
    @ApiProperty({ description: 'Post Id' })
    @IsNotEmpty()
    id: string;
}
