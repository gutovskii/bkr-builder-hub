import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from './user.decorator';
import { UserPayload } from './user.payload';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatarImg'))
  async register(
    @Body()
    body: {
      nickname: string;
      password: string;
      email: string;
      isAdmin?: boolean;
    },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 100_000_000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatarImg: Express.Multer.File,
  ) {
    return this.authService.register(
      body.nickname,
      body.password,
      body.email,
      body.isAdmin ?? false,
      avatarImg.buffer,
    );
  }

  @Post('login')
  async login(@Body() body: { nickname: string; password: string }) {
    return this.authService.login(body.nickname, body.password);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async findUser(@User() user: UserPayload) {
    return this.authService.findUser(user.id);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@User() user: UserPayload) {
    return user;
  }
}
