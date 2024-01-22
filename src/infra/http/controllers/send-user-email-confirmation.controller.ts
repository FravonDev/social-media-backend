import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendUserEmailConfirmationUseCase } from '@/domain/app/use-cases/user/send-user-email-confirmation';
import { SendEmailConfirmationBody } from './dtos/send-email-confirmation-body';
import { Public } from '@/infra/auth/public';
import { EmailAlreadyExistsError } from '@/domain/app/use-cases/user/errors/email-already-exists';

@Controller('send-email-confirmation')
export class SendUserEmailConfirmationController {
  constructor(private sendEmail: SendUserEmailConfirmationUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Sent' })
  @ApiOperation({ summary: 'Send confirmation code to email' })
  async handle(@Body() body: SendEmailConfirmationBody) {
    const { email } = body;

    const result = await this.sendEmail.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
