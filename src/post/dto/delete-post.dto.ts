import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePostDto {
    @ApiProperty({ description: 'Post Id' })
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
