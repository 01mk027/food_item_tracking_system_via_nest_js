import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UsersController } from './user.controller';
import { LoggerService } from '../logger/logger.service';
import { CreateLoggerDto } from '../logger/create-logger.dto';
import { LoggerEntity } from '../logger/logger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, LoggerEntity])],
  providers: [UsersService, Logger, LoggerService, CreateLoggerDto],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
