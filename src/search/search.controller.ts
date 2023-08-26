import {
  Controller,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchPaginationParams } from './dto/search-pagination.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get search results' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @HttpCode(200)
  search(@Query() searchaginationParams: SearchPaginationParams) {
    const { offset, limit, searchTerm } = searchaginationParams;

    return this.searchService.search(searchTerm, offset, limit);
  }
}
