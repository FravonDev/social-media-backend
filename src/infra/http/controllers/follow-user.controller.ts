import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FollowUserUseCase } from '@/app/use-cases/follow/follow-user';
import { FollowUserBody } from './dtos/follow-body';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { AlreadyFollowUserError } from '@/app/use-cases/follow/errors/already-follow';

@Controller('follow')
export class FollowUserController {
  constructor(private followUser: FollowUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Follow user' })
  async handle(@Body() body: FollowUserBody, @CurrentUser() user: UserPayload) {
    const { username } = body;

    const result = await this.followUser.execute({
      followerId: user.sub,
      username,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AlreadyFollowUserError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
