import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './create-recipe.dto';
import { Repository, UpdateDescription } from 'typeorm';
import { Recipe } from './recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/user.entity';
import * as moment from 'moment';
import { UpdateRecipeDto } from './update-recipe.dto';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>){

    }


    async fetchSingleRecipe(id: number): Promise<Recipe>
    {
      const isUserFound = this.recipeRepository.findOne({
        where: {
          id: id
        }
      });
  
      if(!isUserFound) {
        throw new NotFoundException(`"${id} idsi ile kayıtlı tarif bulunamadı.`);
      }
  
      return isUserFound;
    }


    async addRecipe(recipeDto: CreateRecipeDto, incidentUser: Users){
        /*
        let { item_name, unit, quantity, updated_at, portion } = createItemDto;
        const updatedItem = this.updatedItemRepository.create({
            item_name, unit, quantity, updated_at, portion
        });
        
        await this.updatedItemRepository.save(updatedItem);
        return updatedItem;
        */

        //req.user, created_at
        let { cook_name, items, user, description, created_at } = recipeDto;
        user = incidentUser;
        created_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
        const addedRecipe = this.recipeRepository.create({
            cook_name, items, user, description, created_at
        });
        
        await this.recipeRepository.save(addedRecipe);
        return addedRecipe;
    }

    async fetchRecipes(){
        return this.recipeRepository.find();
    }

    async deleteRecipe(id: number){
        return this.recipeRepository.delete(id);
    }

    
    async updateRecipe(id: number, updateRecipeDto: UpdateRecipeDto){
        const hasItem = await this.fetchSingleRecipe(id);
        if(!hasItem){
          throw new NotFoundException(`"${id}" idsi ile kayıtlı kullanıcı bulunamadı.`);
        }
        //console.log(hasItem);
        if(!updateRecipeDto.updated_at){
          updateRecipeDto.updated_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();   
        }
        await this.recipeRepository.update(id, updateRecipeDto);
      }
      
}
