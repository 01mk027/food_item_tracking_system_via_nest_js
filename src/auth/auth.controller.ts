import { Controller, Post, Body, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.auth.guard';
import { AuthenticatedGuard } from './authenticated.guard';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { CreateLoggerDto } from '../logger/create-logger.dto';
import * as moment from 'moment';
import { UsersService } from '../users/users.service';
import { Users } from '../users/user.entity';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private loggerService: LoggerService, private userService: UsersService){

    }

    @UseGuards(AuthenticatedGuard)
    @Post('/is-authenticated')
    isAuthenticated(@Req() req: Request){
        return req.isAuthenticated();
    }

    /*
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req, @Res() response: Response){
        console.log(response.headersSent);
        return response.status(200).send(req.user);
        //return req.user;
    }
    */


    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Req() req: Request, @Res() response: Response){
        
        const user = req.user as Users;
        const loggerDto = new CreateLoggerDto();
        loggerDto.user = user;
        loggerDto.host = req.ip;
        loggerDto.transaction = "Başarılı Giriş";
        loggerDto.message = `${user.username} başarıyla giriş yaptı.`;
        loggerDto.type = "Başarılı giriş";
        this.loggerService.writeLog(loggerDto);
        return response.status(200).send({user: req.user,
            cookie: req.cookies['connect.sid']
        });
        //return req.user;
    }


    @UseGuards(AuthenticatedGuard)
    @Get('profile')
    profile(@Req() req: Request){
        return {
            msg: "You are authorized user.",
            user: req.user
        }
    }

    @Post('logout')
    logout(@Req() req: Request, @Res() response: Response){
        const user = req.user as Users;
        console.log(user);
        
        const loggerDto = new CreateLoggerDto();
        loggerDto.user = user;
        loggerDto.host = req.ip;
        loggerDto.transaction = "Başarılı Çıkış";
        loggerDto.message = `${user.username} başarıyla çıkış yaptı.`;
        loggerDto.type = "Başarılı çıkış";
        this.loggerService.writeLog(loggerDto);
        
        req.logOut((err) => console.log(err));
        /*
        req.session.destroy((err) => console.log(err));
        response.clearCookie('connect.sid');
        
        return response.status(200).send({
            msg: "Session destroyed!"
        });
        */
        response.clearCookie('cookieName').send('Cookie deleted');
    }

}
