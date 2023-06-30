import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @IsPublic()
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiOperation({ summary: 'Login user' })
    @Post('user/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['username', 'password'],
        },
      })
    login(@Request() req: AuthRequest) {        
        return this.authService.login(req.user)
    }
}
