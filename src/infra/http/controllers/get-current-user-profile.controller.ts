import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCurrentUserProfileUseCase } from '@/domain/app/use-cases/user/get-current-user-profile';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ResourceNotFoundError } from '@/core/errors/shared/resource-not-found';

@Controller('accounts/summary')
export class GetCurrentUserProfileController {
  constructor(
    private readonly getCurrentUserProfile: GetCurrentUserProfileUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get current user profile' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @HttpCode(200)
  async search(@CurrentUser() user: UserPayload) {
    const { sub: user_id } = user;

    const result = await this.getCurrentUserProfile.execute({
      user_id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new Error(error.message);
      }
    }

    return result.value;
  }
}
