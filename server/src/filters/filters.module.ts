import { Module } from '@nestjs/common';
import { FiltersRepository } from './filters.repository';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';

@Module({
  providers: [FiltersService, FiltersRepository],
  controllers: [FiltersController],
})
export class FiltersModule {}
