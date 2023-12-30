import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticateUserUseCase } from '@/app/use-cases/auth/authenticate-user';
import { AuthenticateUserBody } from './dtos/authenticate-user-body';
import { WrongCredentialsError } from '@/app/use-cases/auth/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

@Controller('accounts/login')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateUserBody) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
