import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { MenuView } from './menu-view.entity';
import { Recipe } from 'src/recipe/recipe.entity'; // Adjust path as per your project structure
import { CreateMenuViewDto } from './create-menu-view.dto';
import * as moment from 'moment';
import { WarehouseItems } from 'src/warehouse_item/warehouse.entity';

@Injectable()
export class MenuViewService {
    constructor(
        @InjectRepository(MenuView)
        private readonly menuViewRepository: Repository<MenuView>
    ) {}

    async save(createMenuViewDto: CreateMenuViewDto){
        if(!createMenuViewDto.created_at || createMenuViewDto.created_at == null){
            createMenuViewDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
        }
        let {recipes, number_of_portions, created_at} = createMenuViewDto;
        const addedView = this.menuViewRepository.create({
            recipes, number_of_portions, created_at
        });

        await this.menuViewRepository.save(addedView);
        return addedView;
    }

    async sortByDate(created_at: string){
        const startDate = moment.default(created_at).startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
        const endDate = moment.default(created_at).endOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
        console.log("IN sortByDate");
        console.log(startDate+" "+endDate);
        console.log("IN sortByDate");
        return this.menuViewRepository.find({
            where: {
                created_at: Between(startDate, endDate)
            }
        });
    }

    async deleteView(id: number){
        return this.menuViewRepository.delete(id);
    }
}
