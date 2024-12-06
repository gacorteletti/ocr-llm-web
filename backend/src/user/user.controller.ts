import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('studio') // users/studio
  getMe(@GetUser() user: User) {
    return user;
  }
}
