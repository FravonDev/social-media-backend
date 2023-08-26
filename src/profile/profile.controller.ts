import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GetProfileParamDto } from './dto/get-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('test')
  a() {
    console.log('test');
  }
  @Get(':username')
  findOne(@Param() getProfileParamDto: GetProfileParamDto) {
    console.log(getProfileParamDto);
    return this.profileService.getUserProfile(getProfileParamDto);
  }
}
