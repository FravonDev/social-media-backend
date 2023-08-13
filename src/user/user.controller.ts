import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CheckUsernameDto } from './dto/check-username.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @IsPublic()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Create user account' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Update user account' })
  @Patch('update')
  updateu(@CurrentUser() currentUser, @Body() data: UpdateUserDto) {
    return this.userService.update(currentUser.id, data);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Delete user account' })
  @Delete('delete')
  remove(@CurrentUser() currentUser) {
    return this.userService.remove(currentUser.id);
  }

  @IsPublic()
  @Post('checkusername')
  async username(@Body() CheckUsername: CheckUsernameDto) {
    return await this.userService.checkUsernameIsAvailable(CheckUsername);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get relevant Posts' })
  @Get('/me')
  @HttpCode(200)
  getMe(@CurrentUser() user: User) {
    return this.userService.getCurrentUser(user);
  }
}
