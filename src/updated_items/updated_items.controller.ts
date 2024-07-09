import { UpdatedItemService } from "./updated_items.service";
import { Roles } from '../auth/roles';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/role.guard';
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UnauthorizedException, Res, Session, Req } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from "../logger/logger.service";
import { CreateLoggerDto } from "../logger/create-logger.dto";
import { Request } from "express";
import { Users } from "../users/user.entity";
import * as moment from 'moment';

@Controller('updated_items')
export class UpdatedItemsController {
    constructor(private readonly updatedItemsService: UpdatedItemService,
      private readonly loggerService: LoggerService,
      private readonly loggerDto: CreateLoggerDto
    ){

    }


    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('sortitemsbydate')
    sortItemsByDate(@Body() date: any, @Req() req: Request, @Res() response: Response){
        
        const user = req.user as Users;
        this.updatedItemsService.fetchItemsByDate(date.date).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = req.ip;
            this.loggerDto.transaction = "Harcanan erzak bilgisi görüntüleme.";
            this.loggerDto.message = `${user.username} harcanan erzak bilgilerini görüntüledi.`;
            this.loggerDto.type = "Harcanan erzak bilgisi görüntüleme.";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);
            return response.status(200).send(resp);
        }).catch(err => {
            return response.status(500).send(err);
        });
        
       
    }
}