import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetProfileParamDto {
  @ApiProperty({ description: 'username' })
  @IsNotEmpty()
  @IsString()
  username: string;
}
