import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GetProfileParamDto } from './dto/get-profile.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  findOne(
    @Param() getProfileParamDto: GetProfileParamDto,
    @CurrentUser() user: User,
  ) {
    return this.profileService.getUserProfile(getProfileParamDto, user.id);
  }
}
