import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FollowUserUseCase } from '@/domain/app/use-cases/follow/follow-user';
import { FollowUserBody } from './dtos/follow-body';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { AlreadyFollowUserError } from '@/domain/app/use-cases/follow/errors/already-follow';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';
import { ConfirmUserEmailUseCase } from '@/domain/app/use-cases/user/confirm-user-email';
import { SendEmailConfirmationBody } from './dtos/send-email-confirmation-body';
import { Public } from '@/infra/auth/public';
import { EmailAlreadyExistsError } from '@/domain/app/use-cases/user/errors/email-already-exists';

@Controller('confirm-email')
export class ConfirmUserEmailController {
  constructor(private sendEmail: ConfirmUserEmailUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Sended' })
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
  }
}
