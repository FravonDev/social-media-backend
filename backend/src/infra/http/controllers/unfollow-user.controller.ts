import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UnfollowUserBody } from './dtos/unfollow-body';
import { UnfollowUserUseCase } from '@/app/use-cases/follow/unfollow-user';
import { NotFollowUserError } from '@/app/use-cases/follow/errors/not-following';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';

@Controller('unfollow')
export class UnfollowUserController {
  constructor(private unfollowUser: UnfollowUserUseCase) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Unfollow a user by username' })
  @Delete()
  @HttpCode(200)
  async handle(
    @Body() body: UnfollowUserBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { username } = body;
    const result = await this.unfollowUser.execute({
      followerId: user.sub,
      username,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotFollowUserError || UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
