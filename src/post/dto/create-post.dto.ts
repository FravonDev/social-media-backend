import {
    IsOptional,
    IsString,
    IsUrl,
    IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @IsString()
    @ApiProperty({ description: 'The text of the post' })
    @IsOptional()
    @IsNotEmpty()
    text?: string;

    @IsUrl()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        description: 'The url of images'
    })
    images?: string;
}