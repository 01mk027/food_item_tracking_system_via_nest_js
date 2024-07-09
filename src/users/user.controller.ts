import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards, Put, Param, Delete, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './create-user.dto';
import { UpdateUsersDto } from './update-user.dto';
import { Users } from './user.entity';



import { Request, Response } from 'express';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RolesGuard } from '../auth/role.guard';
import {Roles} from '../auth/roles';
import {Role} from '../auth/roles.enum';
import { LoggerService } from '../logger/logger.service';
import { CreateLoggerDto } from '../logger/create-logger.dto';
import * as moment from 'moment';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService,
      private readonly loggerService: LoggerService,
      private readonly loggerDto: CreateLoggerDto
    ){
      
    }


  //Bu route için, servera kurulmadan evvel işlem yapılacak unutma, ya mac adresi tabanlı bir koruma veya ???  
  @Post('adduser')
  //@Csrf()
  async addUser(@Body() createUsersDto:CreateUsersDto, @Req() req: any, @Res() response: Response)
  {
     const user = req.user as Users;
     this.usersService.addUser(createUsersDto).then(resp => {
      response.setHeader('Access-Control-Allow-Credentials', 'true');
      this.loggerDto.user = user ? user : null;
      this.loggerDto.host = req.ip;
      this.loggerDto.transaction = "Kullanıcı ekleme";
      this.loggerDto.message = user ? `${user.username} isimli kullanıcı, ${createUsersDto.username} isminde, ${createUsersDto.user_role === 1 ? 'Admin' : 'Kullanıcı'} düzeyinde bir kullanıcı eklemesi gerçekleştirdi.` : `${req.ip} ip numaralı cihazdan  ${createUsersDto.username} isminde, ${createUsersDto.user_role === 1 ? 'Admin' : 'Kullanıcı'} düzeyinde, bir kullanıcı eklemesi gerçekleştirdi.`;
      this.loggerDto.type = "Kullanıcı ekleme";
      this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
      this.loggerService.writeLog(this.loggerDto);
      return response.status(200).send(resp);
     }).catch((err: any) => {
      console.log(err);
      return response.status(500).send(err);
     });
  }

  @Roles(Role.Admin)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get()
  
  //@Csrf()
  async showUsers(@Req() req: Request, @Res() response: Response){
      
      const user = req.user as Users;
      this.usersService.fetchUsers().then(resp => {
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        this.loggerDto.user = user;
        this.loggerDto.host = req.ip;
        this.loggerDto.transaction = "Kullanıcılar listesini görüntüleme.";
        this.loggerDto.message = `${user.username} isimli kullanıcı, kullanıcılar listesini görüntüledi.`;
        this.loggerDto.type = "Kullanıcılar listesini görüntüleme.";
        this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
        this.loggerService.writeLog(this.loggerDto);
        return response.status(200).send(resp);
      }).catch(err => {
        
        return response.status(500).send(err);
      });
    
    //return req.user;
    //return this.usersService.fetchUsers();
  }

  
  @Roles(Role.Admin)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put('/:id')
  //@Csrf()
  async updateUser(@Param('id') id: number, @Body() data: UpdateUsersDto, @Req() request: any, @Res() response: Response)
  {
     
        const user = new Users();
        const visitor = request.user as Users;
        Object.assign(user, data);
        this.usersService.updateUser(id, data).then(resp => {
          this.loggerDto.user = visitor;
          this.loggerDto.host = request.ip;
          this.loggerDto.transaction = "Kullanıcı güncelleme.";
          this.loggerDto.message = `${visitor.username} isimli kullanıcı, ${id} id'li kullanıcının bilgilerini güncelledi.`;
          this.loggerDto.type = "Kullanıcı güncelleme.";
          this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
          this.loggerService.writeLog(this.loggerDto);
          return response.status(200).send({
            "mesaj": `${id} idli kullanıcı başarıyla güncellendi.`
          });
        }).catch(err => {
          return response.status(err.statusCode).send(err);
        });
       

      /*
      const user = new Users();
      Object.assign(user, data);
      await this.usersService.updateUser(id, data);
      return {
        message: 'Kullanıcı başarıyla güncellendi.'
      }
      */
  }
/*
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  @Csrf()
  async deleteUser(@Param('id') id: number, @Req() request: any, @Res() response: Response){
    request.user.then(u => {
      if(u.user_role != 1){
        return response.status(401).send("Yetkisiz erişim.");
      }

      this.usersService.removeUser(id).then(resp => {
        return response.status(200).send({
          "mesaj": "Kullanıcı başarıyla silindi."
        });
      }).catch((err: any) => {
        return response.status(500).send(err);
      });
    }).catch((err: any) => {
      return response.status(500).send(err);
    })
    /*
    await this.usersService.removeUser(id);
    return {
      message: "Kullanıcı başarıyla silindi."
    }
    
  }
*/
  
@Roles(Role.Admin)
@UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete('suspend/:id')
  //@Csrf()
  async suspendUser(@Param('id') id: number, @Body() data: UpdateUsersDto, @Req() request: any, @Res() response: Response){

        const user = request.user as Users;
        this.usersService.suspendUser(id, data).then(resp => {
          this.loggerDto.user = user;
          this.loggerDto.host = request.ip;
          this.loggerDto.transaction = "Kullanıcı hesabı askıya alma.";
          this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli kullanıcının hesabını askıya aldı.`;
          this.loggerDto.type = "Kullanıcı hesabı askıya alma.";
          this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
          this.loggerService.writeLog(this.loggerDto);
          return response.status(200).send(resp);
        }).catch((err: any) => {
          
          return response.status(500).send(err);
        })
  }


  @Roles(Role.Admin)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put('unsuspend/:id')
  //@Csrf()
  async unsuspendUser(@Param('id') id: number, @Body() data: UpdateUsersDto, @Req() request: any, @Res() response: Response){
        
        const user = request.user as Users;
        this.usersService.unsuspendUser(id, data).then(resp => {
          this.loggerDto.user = user;
          this.loggerDto.host = request.ip;
          this.loggerDto.transaction = "Kullanıcı hesabı askıya alma iptal.";
          this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli kullanıcının hesabını askıdan aldı.`;
          this.loggerDto.type = "Kullanıcı hesabı askıya alma iptal.";
          this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
          this.loggerService.writeLog(this.loggerDto);
          return response.status(200).send(resp);
        }).catch((err: any) => {
          
          return response.status(500).send(err);
        })
      
  }

  @Roles(Role.Admin)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('getusers')
  async getUsers(@Req() request: Request, @Res() response: Response){
    const user = request.user as Users;
    this.usersService.retrieveUsers().then(resp => {
      this.loggerDto.user = user;
      this.loggerDto.host = request.ip;
      this.loggerDto.transaction = "Kullanıcı listesi edinme";
      this.loggerDto.message = `${user.username} isimli kullanıcı, tüm kullanıcıların listesini edindi.`;
      this.loggerDto.type = "Kullanıcı listesi edinme";
      this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
      this.loggerService.writeLog(this.loggerDto);
      return response.status(200).send(resp);
    }).catch(err => {
      return response.status(500).send(err);
    });
  }

}