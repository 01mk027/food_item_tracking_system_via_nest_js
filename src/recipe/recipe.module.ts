import { Logger, Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Users } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Recipe } from './recipe.entity';
import { LoggerModule } from '../logger/logger.module';
import { UsersModule } from '../users/users.module';
import { LoggerEntity } from '../logger/logger.entity';
import { LoggerService } from '../logger/logger.service';
import { CreateLoggerDto } from '../logger/create-logger.dto';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Users, LoggerEntity]), LoggerModule, UsersModule],
  providers: [RecipeService, UsersService, LoggerEntity, Logger, LoggerService, CreateLoggerDto],
  controllers: [RecipeController]
})
export class RecipeModule {}
