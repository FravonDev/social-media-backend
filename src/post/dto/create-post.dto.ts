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
   
    @Matches(/http:\/\/localhost:3000\/images/, { each: true, message: 'Each image must match http://localhost:3000/images ' })
    @ArrayMaxSize(10)
    images?: string[];

}