import { IsOptional, IsString, Matches, MaxLength, MinLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @MinLength(4)
  @MaxLength(64)
  @IsString()
  @ApiProperty({
    description: 'The name of user',
    minimum: 4,
     maximum: 64,
    required: false
  })
  name?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(64)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({ description: 'The password containing between 4-64 characters, containing lowercase, Uppercase and numbers', minimum: 4, maximum: 64, required: false })
  password?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    description: 'The url of image',
    required: false
  })
  photo?: string;
}