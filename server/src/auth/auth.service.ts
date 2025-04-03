import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { UserPayload } from './user.payload';
import { AwsService } from 'src/aws/aws.service';
import { PrismaClient } from '@zenstackhq/runtime';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ENHANCED_PRISMA) private readonly prismaService: PrismaClient,
    private readonly awsService: AwsService,
  ) {}

  private key = 'key';

  async register(
    nickname: string,
    password: string,
    email: string,
    isAdmin = false,
    avatarBuffer: Buffer,
  ) {
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarFileName = `${uuid.v4()}${nickname}${email}`;

    const avatarUrl = await this.awsService.uploadFileByBuffer(
      avatarFileName,
      '.png',
      avatarBuffer,
    );

    const user = await this.prismaService.userEntity.create({
      data: { nickname, hashPassword, email, isAdmin, avatarUrl },
    });

    const payload: UserPayload = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      avatarUrl: user.avatarUrl,
    };

    const token = jwt.sign(payload, this.key, { expiresIn: '1d' });

    return { accessToken: token };
  }

  async login(nickname: string, password: string) {
    const user = await this.prismaService.userEntity.findFirst({
      where: { nickname },
    });
    if (!user || !(await bcrypt.compare(password, user.hashPassword))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: UserPayload = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      avatarUrl: user.avatarUrl,
    };

    const token = jwt.sign(payload, this.key, { expiresIn: '1d' });

    return { accessToken: token };
  }

  async findUser(id: string) {
    const user = await this.prismaService.userEntity.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return user;
  }
}
