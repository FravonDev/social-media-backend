import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateUserBody {
  @IsEmail()
  @ApiProperty({
    description: 'The email address',
  })
  email: string;

  @ApiProperty({
    description: 'The password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
