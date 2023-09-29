import { SearchUsersUseCase } from '@/app/use-cases/search/search-user';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchUsersParams } from './dtos/search-users-params';

@Controller('search/users')
export class SearchUsersController {
  constructor(private readonly searchUseCase: SearchUsersUseCase) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get search results' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @HttpCode(200)
  async search(@Query() searchUsersParams: SearchUsersParams) {
    const { offset, limit, query } = searchUsersParams;

    const result = await this.searchUseCase.execute({
      query,
      offset,
      limit,
    });
  }
}
