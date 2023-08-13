import {
    IsOptional,
    IsString,
    IsArray,
    ArrayMaxSize,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

    @IsString()
    @ApiProperty({ description: 'The text of the post' })
    @IsOptional()
    text?: string;

    @IsOptional()
    @ApiProperty({ description: 'The url of images' })
    @IsArray()
    @Matches(/http:\/\/localhost:3000\/image/, { each: true, message: 'Each image must match http://localhost:3000/image ' })
    @ArrayMaxSize(5)
    images?: string[];

}