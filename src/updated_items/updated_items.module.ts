import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdatedItems } from '../updated_items/updated_items.entity';
import { UpdatedItemService } from '../updated_items/updated_items.service';
import { UpdatedItemsController } from './updated_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerEntity } from '../logger/logger.entity';
import { LoggerService } from '../logger/logger.service';
import { CreateLoggerDto } from '../logger/create-logger.dto';


@Module({
  imports: [TypeOrmModule.forFeature([UpdatedItems, LoggerEntity])],
  providers: [UpdatedItemService, Logger, LoggerService, CreateLoggerDto],
  controllers: [UpdatedItemsController]
})
export class UpdatedItemsModule {}
