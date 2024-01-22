import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/infra/auth/public';
import { EmailAlreadyExistsError } from '@/domain/app/use-cases/user/errors/email-already-exists';
import { ConfirmUserEmailUseCase } from '@/domain/app/use-cases/user/confirm-user-email';
import { ConfirmUserEmailBody } from './dtos/confirm-user-email-body';

@Controller('confirm-email')
export class ConfirmUserEmailController {
  constructor(private confirmEmail: ConfirmUserEmailUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Sended' })
  @ApiOperation({ summary: 'Send confirmation code to email' })
  async handle(@Body() body: ConfirmUserEmailBody) {
    const { email, code } = body;

    const result = await this.confirmEmail.execute({
      email,
      code,
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
