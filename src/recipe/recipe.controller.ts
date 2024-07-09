import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { CreateRecipeDto } from './create-recipe.dto';
import { Request, Response } from 'express';
import { Roles } from '../auth/roles';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/role.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RecipeService } from './recipe.service';
import { Users } from '../users/user.entity';
import { CreateLoggerDto } from '../logger/create-logger.dto';
import { LoggerService } from '../logger/logger.service';
import * as moment from 'moment';
import { UpdateRecipeDto } from './update-recipe.dto';



@Controller('recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService,
        private readonly loggerService: LoggerService,
        private readonly loggerDto: CreateLoggerDto ){
            
        }
    
    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('/addrecipe')
    async addRecipe(@Body() createRecipeDto: CreateRecipeDto, @Req() request: Request, @Res() response: Response){
        const user = request.user as Users;
        
        
        this.recipeService.addRecipe(createRecipeDto, user).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Tarif Ekleme";
            this.loggerDto.message = `${user.username} isimli kullanıcı, ${createRecipeDto.cook_name} isimli bir yemeğin tarifini ekledi.`;
            this.loggerDto.type = "Tarif Ekleme";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);    
            return response.status(200).send("resp");
        }).catch(err => {
            return response.status(500).send("err");
        })
        
    }

    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Get('/fetchrecipes')
    async fetchRecipes(@Req() request: Request, @Res() response: Response){
        const user = request.user as Users;
        
        
        this.recipeService.fetchRecipes().then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Tarifleri Görüntüleme";
            this.loggerDto.message = `${user.username} isimli kullanıcı, tarifleri görüntüledi.`;
            this.loggerDto.type = "Tarifleri Görüntüleme";
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
    async deleteRecipe(@Param('id') id: number, @Req() request: Request, @Res() response: Response){
        const user = request.user as Users;
        this.recipeService.deleteRecipe(id).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Tarif Silme";
            this.loggerDto.message = `${user.username} isimli kullanıcı, tarif sildi.`;
            this.loggerDto.type = "Tarif Silme";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);
            return response.status(200).send(resp);
        }).catch(err => {
            return response.status(500).send(err);
        })
    }

    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Put('/:id')
    async updateRecipe(@Param('id') id: number, @Body() updateRecipeDto: UpdateRecipeDto, @Req() request: Request, @Res() response: Response){
        console.log("hjhj\n", updateRecipeDto);
        const user = request.user as Users;
        this.recipeService.updateRecipe(id, updateRecipeDto).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Tarif Güncelleme";
            this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli tarifi güncelledi.`;
            this.loggerDto.type = "Tarif Güncelleme";
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
    @Get('/:id')
    async fetchRecipeById(@Param('id') id: number, @Req() request: Request, @Res() response: Response){
        const user = request.user as Users;
        this.recipeService.fetchSingleRecipe(id).then(resp => {
            this.loggerDto.user = user;
            this.loggerDto.host = request.ip;
            this.loggerDto.transaction = "Tarif Sorgulama";
            this.loggerDto.message = `${user.username} isimli kullanıcı, ${id} idli tarifi sorguladı.`;
            this.loggerDto.type = "Tarif Sorgulama";
            this.loggerDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
            this.loggerService.writeLog(this.loggerDto);
            return response.status(200).send(resp);
        }).catch(err => {
            console.log(err);
            return response.status(500).send(err);
        })
    }
}
