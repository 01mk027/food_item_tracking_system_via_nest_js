import { Logger, Module } from '@nestjs/common';
import { WarehouseItemService } from './warehouse_item.service';
import { WarehouseItemController } from './warehouse_item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseItems } from './warehouse.entity';

import { JwtService } from '@nestjs/jwt';
import { UpdatedItems } from '../updated_items/updated_items.entity';
import { UpdatedItemService } from '../updated_items/updated_items.service';
import { LoggerModule } from '../logger/logger.module';
import { LoggerEntity } from '../logger/logger.entity';
import { UsersModule } from '../users/users.module';
import { LoggerService } from '../logger/logger.service';
import { CreateLoggerDto } from '../logger/create-logger.dto';


@Module({
  imports: [TypeOrmModule.forFeature([WarehouseItems, UpdatedItems, LoggerEntity]), LoggerModule, UsersModule],
  providers: [WarehouseItemService, UpdatedItemService, Logger, LoggerService, CreateLoggerDto],
  controllers: [WarehouseItemController]
})
export class WarehouseItemModule {}
