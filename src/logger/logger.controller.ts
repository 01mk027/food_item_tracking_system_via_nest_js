import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';
import { Roles } from '../auth/roles';
import { Role } from '../auth/roles.enum';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RolesGuard } from '../auth/role.guard';
import { Users } from '../users/user.entity';

@Controller('logger')
export class LoggerController {
    
    constructor(private readonly loggerService: LoggerService){

    }

    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('logsinbetweentwodates')
    async logsInBetweenTwoDates(@Req() request: Request, @Res() response: Response, @Body() body: any){
        await this.loggerService.writeLogBetweenTwoDates(body.firstDate, body.secondDate).then(resp => {
            return response.status(200).send(resp);
        }).catch(err => {
            return response.status(500).send(err);
        }); 
    }

    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('/gettransactiontypes')
    async retrieveTypes(@Req() request: Request, @Res() response: Response){
        await this.loggerService.retrieveTransactionTypes().then(resp => {
            return response.status(200).send(resp);
        }).catch(err => {
            return response.status(500).send(err);
        }
        )
    }

    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('/getlogsbytype')
    async getLogsByType(@Req() request: Request, @Res() response: Response, @Body() body: any)
    {
        await this.loggerService.retrieveLogsByType(body.body).then(resp => {
            return response.status(200).send(resp);
        }).catch(err => {
            return response.status(500).send(err);
        })
    }

    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('/getlogsbyuser')
    async getLogsByUser(@Req() request: Request, @Res() response: Response, @Body() body: any){
       await this.loggerService.retrieveLogsByUsername(body.username).then(resp => {
            return response.status(200).send(resp);
       }).catch(err => {
            console.log(err);
            return response.status(500).send(err);
       }) 
    }    
    
}
