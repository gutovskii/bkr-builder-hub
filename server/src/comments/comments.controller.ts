import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationConfig, PaginationPipe } from 'src/common/pagination.pipe';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentOwnerGuard } from './comment-owner.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get(':buildId')
  findAll(
    @Param('buildId', ParseUUIDPipe) buildId: string,
    @Query(PaginationPipe) pagination: PaginationConfig,
  ) {
    return this.commentsService.findAll(pagination, buildId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, CommentOwnerGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, CommentOwnerGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.remove(id);
  }
}
