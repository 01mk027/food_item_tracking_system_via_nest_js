import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  passport from 'passport';


import cookieParser from "cookie-parser";
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';


//Front-end tarafında headerlara "role" ve "csrf-token" kısımları eklenecek.
//"role" karşılığı 1
//"csrf-token" karşılığı oturum açıldığında buradan gönderilen nesne içerisindeki "token" keyine karşılık gelen değer

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();  



  // Enable CORS
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Role'],
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials such as cookies, authorization headers, etc.
  });
  app.use(session({
    secret: "biib",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 3600000
    }
  }));

  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session())




  await app.listen(process.env.PORT);
  logger.log(`Uygulama ${process.env.PORT} no'lu portta çalışıyor.`);
}
bootstrap();
