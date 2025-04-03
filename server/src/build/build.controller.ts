import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BuildService } from './build.service';
import {
  ComponentsExistPipe,
  CreateFullBuildDto,
} from './components-exist.pipe';
import { AuthGuard } from 'src/auth/auth.guard';
import { BuildDeleteRightGuard } from './build-delete-right.guard';
import { PaginationConfig, PaginationPipe } from 'src/common/pagination.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/user.decorator';
import { UserPayload } from 'src/auth/user.payload';
import {
  FilterQuery,
  QueryFilterPipe,
} from 'src/components/pipes/query-filter.pipe';

export const BUILDS_FILTER_KEY = 'BUILDS_FILTER';

@Controller('builds')
export class BuildController {
  constructor(private readonly buildService: BuildService) {}

  @Get()
  getBuilds(
    @Query('name') name: string,
    @Query(PaginationPipe) pagination: PaginationConfig,
    @Query(QueryFilterPipe) filters: FilterQuery,
  ) {
    return this.buildService.findAll(name, pagination, filters);
  }

  @Get(':id')
  getBuild(@Param('id', ParseUUIDPipe) id: string) {
    return this.buildService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('imgs', 10, {
      limits: { fileSize: 5 * 1024 * 1024 } /* 5mb */,
    }),
  )
  createBuild(
    @Body(ComponentsExistPipe) dto: CreateFullBuildDto,
    @UploadedFiles() imgs: Express.Multer.File[],
    @User() user: UserPayload,
  ) {
    return this.buildService.create(dto, imgs, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, BuildDeleteRightGuard)
  deleteBuild(@Param('id', ParseUUIDPipe) id: string) {
    return this.buildService.delete(id);
  }
}
