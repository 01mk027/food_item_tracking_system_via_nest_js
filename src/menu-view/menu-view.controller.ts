import { Controller, Post, Body, Req, Res, UseGuards, Param, Delete } from '@nestjs/common';
import { MenuViewService } from './menu-view.service';
import { MenuView } from './menu-view.entity';
import { CreateMenuViewDto } from './create-menu-view.dto';
import { Request, Response } from 'express';
import { Roles } from '../auth/roles';
import { Role } from '../auth/roles.enum';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RolesGuard } from '../auth/role.guard';
import { LoggerService } from '../logger/logger.service';
import { CreateLoggerDto } from '../logger/create-logger.dto';
import { Users } from '../users/user.entity';
import * as moment from 'moment';

@Controller('menu-view')
export class MenuViewController {
    constructor(private readonly menuViewService: MenuViewService,
        private readonly loggerService: LoggerService,
        private readonly loggerDto: CreateLoggerDto
    ) {}

    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post()
    async createMenuViewWithRecipes(@Body() createMenuViewDto: CreateMenuViewDto, @Req() request: Request, @Res() response: Response){
        const user = request.user as Users;
        this.menuViewService.save(createMenuViewDto).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Menü görünümü oluşturma";
            this.loggerDto.message = `${user.username} isimli kullanıcı, menü görünümü oluşturdu.`;
            this.loggerDto.type = "Menü görünümü oluşturma";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);
            return response.status(200).send(resp);
        }).catch(err => {
            console.log(err);
            return response.status(500).send(err);
        })
    }

    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('sortbydate')
    async sortByDate(@Body() body: any, @Req() request: Request, @Res() response: Response)
    {
        const user = request.user as Users;
        this.menuViewService.sortByDate(body.date).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Menü görünümü sıralama";
            this.loggerDto.message = `${user.username} isimli kullanıcı, menü görünümü sıralaması gerçekleştirdi.`;
            this.loggerDto.type = "Menü görünümü sıralama";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);
            return response.status(200).send(resp);
        }).catch(err => {
            return response.status(500).send(err);
        })
    }

    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Delete('/:id')
    async deleteView(@Param('id') id: number, @Req() request: Request, @Res() response: Response){
        const user = request.user as Users;
        this.menuViewService.deleteView(id).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Menü görünümü silme";
            this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli menü görünümünü sildi.`;
            this.loggerDto.type = "Menü görünümü silme";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);
            return response.status(200).send(resp);
        }).catch(err => {
            return response.status(500).send(err);
        })
    }
}
