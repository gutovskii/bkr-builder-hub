import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import { enhance } from '@zenstackhq/runtime';
import { ComponentsModule } from './components/components.module';
import { BuildModule } from './build/build.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { FiltersModule } from './filters/filters.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ComponentsModule,
    ZenStackModule.registerAsync({
      global: true,
      useFactory: (prisma: PrismaService) => {
        return {
          getEnhancedPrisma: () => enhance(prisma),
        };
      },
      inject: [PrismaService],
      extraProviders: [PrismaService],
    }),
    BuildModule,
    CommentsModule,
    FiltersModule,
    UsersModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
