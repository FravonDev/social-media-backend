import { Public } from '@/infra/auth/public';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckUsernameAvailabilityBody } from './dtos/check-username-availability-body';
import { CheckUsernameAvailabilityUseCase } from '@/domain/app/use-cases/user/check-username-availability';

@Controller('/accounts/username/availability')
export class CheckUsernameAvailabilityController {
  constructor(
    private readonly checkUsernameAvailabilityUseCase: CheckUsernameAvailabilityUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Check username availability' })
  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  @HttpCode(200)
  async search(@Body() body: CheckUsernameAvailabilityBody) {
    const { username } = body;

    const result = await this.checkUsernameAvailabilityUseCase.execute({
      username,
    });

    const IsAvailable = result.value;

    return IsAvailable;
  }
}
