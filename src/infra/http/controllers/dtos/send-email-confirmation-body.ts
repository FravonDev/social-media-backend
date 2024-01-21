import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailConfirmationBody {
  @IsEmail()
  @ApiProperty({ description: 'Email to send verification code' })
  email: string;
}
