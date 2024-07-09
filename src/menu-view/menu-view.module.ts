import { Module } from '@nestjs/common';
import { MenuViewService } from './menu-view.service';
import { MenuViewController } from './menu-view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuView } from './menu-view.entity';
import { Recipe } from '../recipe/recipe.entity';
import { LoggerEntity } from '../logger/logger.entity';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';
import { CreateLoggerDto } from '../logger/create-logger.dto';

@Module({
  imports: [TypeOrmModule.forFeature([MenuView, Recipe, LoggerEntity]), LoggerModule],
  controllers: [MenuViewController],
  providers: [MenuViewService, LoggerEntity, LoggerService, CreateLoggerDto]
})
export class MenuViewModule {}
