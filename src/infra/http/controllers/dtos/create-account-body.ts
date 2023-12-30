import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountBody {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  @ApiProperty({ description: 'The username' })
  username: string;

  @MinLength(4)
  @MaxLength(64)
  @IsString()
  @ApiProperty({
    description: 'The name of user',
    minimum: 4,
    maximum: 64,
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email address',
  })
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(64)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({
    description:
      'The password containing between 4-64 characters, containing lowercase, Uppercase and numbers',
    minimum: 4,
    maximum: 64,
  })
  password: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    description: 'The url of image',
  })
  photo?: string;

  @MaxLength(180)
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The bio of user',
    maximum: 180,
  })
  bio: string;
}
