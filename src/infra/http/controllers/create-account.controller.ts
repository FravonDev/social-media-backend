import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';

import { AccountAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';
import { Public } from '@/infra/auth/public';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAccountBody } from './dtos/create-account-body';
import { CreateAccountUseCase } from '@/domain/social-media/application/use-cases/user/create-user-account';

@Controller('/accounts/register')
@Public()
export class CreateAccountController {
  constructor(private createAccount: CreateAccountUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Create user account' })
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password, username, photo, bio } = body;

    const result = await this.createAccount.execute({
      email,
      name,
      username,
      password,
      photo: photo ?? null,
      bio: bio ?? null,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AccountAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
