import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { LoggerEntity } from './logger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [LoggerService],
  exports:[LoggerService],
  controllers: [LoggerController],
  imports:[TypeOrmModule.forFeature([LoggerEntity])]
})
export class LoggerModule {}
