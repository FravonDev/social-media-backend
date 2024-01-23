import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Max, Min } from 'class-validator';

export class ConfirmUserEmailBody {
  @IsEmail()
  @ApiProperty({ description: 'Email to send verification code' })
  email: string;

  @ApiProperty({ description: '6 digits code to verify email' })
  @IsString({ message: 'code must be a string' })
  code: string;
}
