import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { SessionSerializer } from './session.serializer';
import { LoggerModule } from 'src/logger/logger.module';


@Module({
  imports:[
    UsersModule,
    PassportModule.register({
    session: true
  }),
  LoggerModule
],
  providers: [AuthService, LocalStrategy, SessionSerializer, Logger],
  controllers: [AuthController]
})
export class AuthModule {}
