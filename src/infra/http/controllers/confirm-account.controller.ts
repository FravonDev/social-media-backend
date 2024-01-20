import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/infra/auth/public';
import { ConfirmAccountParams } from './dtos/confirm-account-params';
import { ConfirmAccountUseCase } from '@/domain/app/use-cases/user/confirm-account';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';

@Controller('/accounts/confirm')
export class ConfirmAccountController {
  constructor(private confirmAccount: ConfirmAccountUseCase) {}

  @Get()
  @HttpCode(200)
  @Public()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Confirm account' })
  async handle(@Query() param: ConfirmAccountParams) {
    const { token } = param;

    const result = await this.confirmAccount.execute({ token });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
