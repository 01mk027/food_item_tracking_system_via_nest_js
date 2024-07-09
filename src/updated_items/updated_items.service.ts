import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdatedItems } from "./updated_items.entity";
import { Repository } from "typeorm";
import { CreateUpdItemDto } from "./create-item.dto";
import { WarehouseItems } from "../warehouse_item/warehouse.entity";
import * as moment from 'moment';
import { Between } from "typeorm";


@Injectable()
export class UpdatedItemService {
    constructor(
        @InjectRepository(UpdatedItems)
        private updatedItemRepository: Repository<UpdatedItems>
    ){

    }

    async addItem(createItemDto: CreateUpdItemDto):Promise<UpdatedItems>
    {
        let { item_name, unit, quantity, updated_at, portion } = createItemDto;
        const updatedItem = this.updatedItemRepository.create({
            item_name, unit, quantity, updated_at, portion
        });
        
        await this.updatedItemRepository.save(updatedItem);
        return updatedItem;
    }

    async fetchUpdatedItems(): Promise<UpdatedItems[]>
    {
        return this.updatedItemRepository.find();
    }

    async fetchItemsByDate(date: string){
        let start_of_target_date = moment.default(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        let end_of_target_date = moment.default(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');        
        // return `${start_of_target_date} ${end_of_target_date}`; we are ready to evaluate query between related dates
        // type of updated_at in dbo.updated_items is nvarchar. 
        //between???
        return this.updatedItemRepository.find({
            where: {
                updated_at: Between(start_of_target_date, end_of_target_date)
            }
        })
    }
}