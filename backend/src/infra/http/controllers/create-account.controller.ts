import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAccountBody } from './dtos/create-account-body';
import { CreateUserUseCase } from '@/app/use-cases/user/create-user';
import { UsernameAlreadyExistsError } from '@/app/use-cases/user/errors/username-already-exists';
import { EmailAlreadyExistsError } from '@/app/use-cases/user/errors/email-already-exists';
import { Public } from '@/infra/auth/public';

@Controller('/accounts/register')
export class CreateAccountController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @Public()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Create user account' })
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password, username, photo, bio } = body;

    const result = await this.createUser.execute({
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
        case UsernameAlreadyExistsError || EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
