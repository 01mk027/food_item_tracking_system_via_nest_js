import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseItems } from './warehouse_item/warehouse.entity';
import { WarehouseItemModule } from './warehouse_item/warehouse_item.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import { Users } from './users/user.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SessionModule } from 'nestjs-session';
import * as session from 'express-session';




import * as cors from 'cors';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { UpdatedItems } from './updated_items/updated_items.entity';
import { UpdatedItemsModule } from './updated_items/updated_items.module';
import { LoggerModule } from './logger/logger.module';
import { Logger } from '@nestjs/common';
import { LoggerEntity } from './logger/logger.entity';
import { LocalAuthGuard } from './auth/local.auth.guard';
import { RecipeModule } from './recipe/recipe.module';
import { Recipe } from './recipe/recipe.entity';
import { MenuViewModule } from './menu-view/menu-view.module';
import { MenuView } from './menu-view/menu-view.entity';



@Module({
  imports: [
    SessionModule.forRoot({
      session: {
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DATABASE_HOST,
      port: 1433,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      options:{
        encrypt: false,
        trustServerCertificate: true
      },
      synchronize: true,
      entities: [WarehouseItems, Users, UpdatedItems, LoggerEntity, Recipe, MenuView]
    }),
    WarehouseItemModule,
    
    UsersModule,
    
    AuthModule,

    UpdatedItemsModule,

    LoggerModule,

    RecipeModule,

    MenuViewModule
    
    
  ],
  providers:[Logger, LocalAuthGuard]
})
export class AppModule {

 }
