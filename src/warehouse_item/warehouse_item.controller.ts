import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request, UnauthorizedException, Res, Session } from '@nestjs/common';
import { WarehouseItemService } from './warehouse_item.service';
import { CreateItemDto } from './create-item.dto';
import { UpdateItemDto } from './update-item.dto';
import { WarehouseItems } from './warehouse.entity';

import { Response } from 'express';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import {Role} from "../auth/roles.enum";
import {Roles} from "../auth/roles";
import { RolesGuard } from '../auth/role.guard';
import { UpdatedItemService } from '../updated_items/updated_items.service';
import { CreateUpdItemDto } from '../updated_items/create-item.dto';
import { create } from 'domain';
import * as moment from 'moment';
import { CreateLoggerDto } from '../logger/create-logger.dto';
import { LoggerService } from '../logger/logger.service';
import { User } from '../users/users.service';
import { Users } from '../users/user.entity';


@Controller('depo')
export class WarehouseItemController {
    constructor(private readonly warehouseItemService: WarehouseItemService, 
        private readonly updatedItemService: UpdatedItemService, 
        private readonly loggerService: LoggerService,
        private readonly loggerDto: CreateLoggerDto
    )
    {

    }
    
    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get()
    getItems(@Request() req, @Res() response: Response, @Session() session) {
            const user = req.user as Users;
            this.warehouseItemService.fetchWarehouseItems().then(resp => {
            
                this.loggerDto.user = user;
                this.loggerDto.host = req.ip;
                this.loggerDto.transaction = "Ürün Listeleme";
                this.loggerDto.message = `${user.username} isimli kullanıcı, ürün listelemesi gerçekleştirdi.`;
                this.loggerDto.type = "Ürün Listeleme";
                this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                this.loggerService.writeLog(this.loggerDto);
                return response.status(200).send(resp);
            }).catch(err => {
                return response.status(500).send(err);
            });
    }

    
    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('/:id')
    getItemById(@Request() req, @Param('id') id: number, @Res() response: Response)
    {
            const user = req.user as Users;
            this.warehouseItemService.fetchSingleWarehouseItem(id).then(resp => {
                this.loggerDto.user = user;
                this.loggerDto.host = req.ip;
                this.loggerDto.transaction = "Hususi Ürün Listeleme";
                this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli ürünün bilgisini listeledi.`;
                this.loggerDto.type = "Hususi Ürün Listeleme";
                this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                this.loggerService.writeLog(this.loggerDto);
                return response.status(200).send(resp);
            }).catch(err => {
                return response.status(500).send(err);
            });

    }


    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('getItemByName/:name')
    getItemByName(@Request() req, @Param('name') name: string, @Res() response: Response)
    {
            const user = req.user as Users;
            this.warehouseItemService.findItemByName(name).then(resp => {
                this.loggerDto.user = user;
                this.loggerDto.host = req.ip;
                this.loggerDto.transaction = "Hususi Ürün Listeleme (İsim ile)";
                this.loggerDto.message = `${user.username} isimli kullanıcı, ${name} isimli ürünün bilgisini listeledi.`;
                this.loggerDto.type = "Hususi Ürün Listeleme (İsim ile)";
                this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                this.loggerService.writeLog(this.loggerDto);
                return response.status(200).send(resp);
            }).catch(err => {
                return response.status(500).send(err);
            });

    }

    
    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('additem')
    addItem(@Request() req, @Body() createItemDto: CreateItemDto, @Res() response: Response)
    {
            const user = req.user as Users;
            if(createItemDto.unit <= 0){
                this.loggerDto.user = user;
                this.loggerDto.host = req.ip;
                this.loggerDto.transaction = "Ürün Ekleme Hatası";
                this.loggerDto.message = `${user.username} isimli kullanıcı, ürün eklemek istedi ancak miktar iktifa etmedi.`;
                this.loggerDto.type = "Ürün Ekleme Hatası";
                this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                this.loggerService.writeLog(this.loggerDto);
                return response.status(406).send({
                    "message": "Eklenecek ürün miktarı 0 veya 0'dan küçük olmamalıdır."
                });
            }
            this.warehouseItemService.addItem(createItemDto, req.user).then(resp => {
                this.loggerDto.user = user;
                this.loggerDto.host = req.ip;
                this.loggerDto.transaction = "Ürün Ekleme";
                this.loggerDto.message = `${user.username} isimli kullanıcı, ${createItemDto.item_name} isminde bir ürün ekledi.`;
                this.loggerDto.type = "Ürün Ekleme";
                this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                this.loggerService.writeLog(this.loggerDto);
                return response.status(200).send(resp);
            }).catch(err => {
                return response.status(500).send(err);
            });
            
    }

    
    
    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Delete('/:id')
    async deleteItem(@Param('id') id: number, @Request() request: any, @Res() response: Response)
    {
            const user = request.user as Users;
            const deletedItem = this.warehouseItemService.fetchSingleWarehouseItem(id);
            const itemName = (await deletedItem).item_name;
            this.warehouseItemService.removeItem(id).then(resp => {
                deletedItem.then(u => {
                    this.loggerDto.user = user;
                    this.loggerDto.host = request.ip;
                    this.loggerDto.transaction = "Ürün Silme";
                    this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli ve ${itemName} isimli ürünü sildi.`;
                    this.loggerDto.type = "Ürün Silme";
                    this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                    this.loggerService.writeLog(this.loggerDto);
                })

                return response.status(200).send(resp);
            }).catch(err => {
                return response.status(500).send(err);
            });

        //return this.warehouseItemService.removeItem(id);
    }

    
    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Put('update/:id')
    async updateItem(@Param('id') id: number, @Body() data: UpdateItemDto, @Request() req: any, @Res() response: Response)
    {
            const user = req.user as Users;
            const warehouse_item = new WarehouseItems();
            Object.assign(warehouse_item, data);
            let portionNumber = data.portionNumber;
            delete data['portionNumber'];
            
            let createUpdItem = new CreateUpdItemDto();
            let updatedItem = this.warehouseItemService.fetchSingleWarehouseItem(id);
            createUpdItem.item_name = (await updatedItem).item_name;
            createUpdItem.quantity = (await updatedItem).quantity;
            createUpdItem.unit = data.unit;
            createUpdItem.updated_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            createUpdItem.portion = portionNumber;
            this.warehouseItemService.updateItem(id, data, req.user).then(resp => {
                this.updatedItemService.addItem(createUpdItem).then(res => {
                    this.loggerDto.user = user;
                    this.loggerDto.host = req.ip;
                    this.loggerDto.transaction = "Ürün Güncelleme";
                    this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli ve ${createUpdItem.item_name} isimli ürünü güncelledi.`;
                    this.loggerDto.type = "Ürün Güncelleme";
                    this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                    this.loggerService.writeLog(this.loggerDto);
                    return response.status(200).send({
                        "mesaj": "Erzak başarıyla güncellendi."
                    });
                }).catch(err => {
                    
                    return response.status(500).send(err);
                });
            }).catch(err => {
                
                return response.status(500).send(err);
            });
    }





    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Put('updateByName/:name')
    async updateItemByName(@Param('name') name: string, @Body() data: UpdateItemDto, @Request() req: any, @Res() response: Response)
    {
            const user = req.user as Users;
            const warehouse_item = new WarehouseItems();
            Object.assign(warehouse_item, data);
            let portionNumber = data.portionNumber;
            delete data['portionNumber'];
            
            let createUpdItem = new CreateUpdItemDto();
            let updatedItem = this.warehouseItemService.findItemByName(name);
            createUpdItem.item_name = (await updatedItem).item_name;
            createUpdItem.quantity = (await updatedItem).quantity;
            createUpdItem.unit = data.unit;
            createUpdItem.updated_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            createUpdItem.portion = portionNumber;
            this.warehouseItemService.updateByItemName(name, data, req.user).then(resp => {
                this.updatedItemService.addItem(createUpdItem).then(res => {
                    this.loggerDto.user = user;
                    this.loggerDto.host = req.ip;
                    this.loggerDto.transaction = "Ürün Güncelleme (İsim ile)";
                    this.loggerDto.message = `${user.username} isimli kullanıcı, ${name} isimli ürünü güncelledi.`;
                    this.loggerDto.type = "Ürün Güncelleme";
                    this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                    this.loggerService.writeLog(this.loggerDto);
                    return response.status(200).send({
                        "mesaj": "Erzak başarıyla güncellendi."
                    });
                }).catch(err => {
                    console.log("CRTIO");
                    console.log(err);
                    return response.status(500).send(err);
                });
            }).catch(err => {
                
                return response.status(500).send(err);
            });
    }



    
    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Put('correct/:id')
    async correctItem(@Param('id') id: number, @Body() data: UpdateItemDto, @Request() req: any, @Res() response: Response)
    {
            const user = req.user as Users;
            const warehouse_item = new WarehouseItems();
            if(data.unit <= 0){
                return response.status(406).send({
                    "message": "Miktar 0 veya 0'dan küçük olarak güncellenmemelidir"
                });
            }
            Object.assign(warehouse_item, data);
            this.warehouseItemService.correctItem(id, data, req.user).then(resp => {
                this.loggerDto.user = user;
                this.loggerDto.host = req.ip;
                this.loggerDto.transaction = "Ürün Düzeltme";
                this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli ve ${data.item_name} isimli ürünün bilgilerini düzenledi.`;
                this.loggerDto.type = "Ürün Düzeltme";
                this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
                this.loggerService.writeLog(this.loggerDto);  
                return response.status(200).send(`${id} numaralı ürün başarıyla güncellendi.`);
            })
            .catch(err => {
                return response.status(500).send(err);
            });

        /*

        req.user.then(u => {
            return { message: 'Ürün başarıyla düzeltildi.' }
        })
        */
        
        
       
    }

    @Roles(Role.Admin)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('/:name')
    async findItemByName(@Param('name') name: string, @Request() req: any, @Res() response: Response)
    {
        const user = req.user as Users;
        const warehouseItem = this.warehouseItemService.findItemByName(name);
        if(!warehouseItem){
            return response.status(404).send({
                "message": "Aranan isimde ürün bulunamadı"
            });
        }
        warehouseItem.then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = req.ip;
            this.loggerDto.transaction = "Ürün Bilgisi Görüntüleme";
            this.loggerDto.message = `${user.username} isimli kullanıcı, ${name} isimli ürünün bilgilerini görüntüledi.`;
            this.loggerDto.type = "Ürün Bilgisi Görüntüleme";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);
            return response.status(200).send(resp);
        }).catch(err => {
            
            return response.status(500).send(err);
        })
    }

    
}

