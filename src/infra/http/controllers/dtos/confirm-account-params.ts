import { IsString } from 'class-validator';

export class ConfirmAccountParams {
  @IsString()
  token: string;
}
