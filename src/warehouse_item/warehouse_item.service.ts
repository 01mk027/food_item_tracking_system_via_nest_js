import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './create-item.dto';
import { UpdateItemDto } from './update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseItems } from './warehouse.entity';
import { Repository, UpdateDateColumn } from 'typeorm';
import * as moment from 'moment';
import { Users } from 'src/users/user.entity';


@Injectable()
export class WarehouseItemService {
    constructor(
        @InjectRepository(WarehouseItems)
        private warehouseRepository: Repository<WarehouseItems>
    ){

    }

    async fetchWarehouseItems(): Promise<WarehouseItems[]>
    {
        return this.warehouseRepository.find({
            relations: {
                user: true
            }
        });
    } 

    async fetchSingleWarehouseItem(id: number): Promise<WarehouseItems>
    {
        const found = this.warehouseRepository.findOne({ where: { id: id }, relations:{
            user: true
        } },)
        if (!found){
            throw new NotFoundException(`${id} id'sine sahip bir ürün bulunamadı.`);
        }
        return found;
    }

    async findItemByName(name: string){
        const found = this.warehouseRepository.findOne({ where: {item_name: name} });
        if(!found){
            throw new NotFoundException("Ürün bulunamadı.");
        }
        return found;
    }

    async addItem(createItemDto: CreateItemDto, user: Users): Promise<WarehouseItems>
    {
        let { item_name, unit, quantity, created_at, is_consumed } = createItemDto;
        created_at = null;
        is_consumed = null;
        is_consumed = false;
        created_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
        
        const warehouse_item = this.warehouseRepository.create({
            item_name, unit, quantity, created_at, is_consumed
        });
        warehouse_item.user = user;
        await this.warehouseRepository.save(warehouse_item);
        return warehouse_item;
    }

    async removeItem(id: number) {
        const result = await this.warehouseRepository.delete(id);
        if (result.affected == 0) {
            throw new NotFoundException(`${id} id'sine sahip bir ürün bulunamadı.`);
        }
        return { message: 'Ürün başarıyla kaldırıldı.' }
    }

    async updateItem(id: number, updateItemDto: UpdateItemDto, user: Users) {
        const hasItem = await this.fetchSingleWarehouseItem(id);
        if(!hasItem) throw new NotFoundException(`${id} id'sine sahip bir ürün bulunamadı.`);

        updateItemDto.is_consumed = null;
        updateItemDto.updated_at = null;
        updateItemDto.item_name = hasItem.item_name;
        updateItemDto.user = user;
        //updateItemDto.unit = hasItem.unit;

        updateItemDto.unit = hasItem.unit - updateItemDto.unit;
        updateItemDto.user = user;
        if(updateItemDto.unit > 0) {
            updateItemDto.is_consumed = false;
        }
        else if(updateItemDto.unit == 0)
        {
            updateItemDto.is_consumed = true;
            this.warehouseRepository.delete(id);
        }
        else{
            throw new NotAcceptableException("Depoda eksi miktarda ürün borçlanmayı gösterir.");
        }
        updateItemDto.updated_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();

        await this.warehouseRepository.update(id, updateItemDto);
    }

    async updateByItemName(name: string, updateItemDto: UpdateItemDto, user: Users){
        const hasItem = await this.findItemByName(name);
        if(!hasItem) throw new NotFoundException(`${name} ismiyle kayıtlı ürün bulunamadı.`);
    
        updateItemDto.is_consumed = null;
        updateItemDto.updated_at = null;
        updateItemDto.item_name = hasItem.item_name;
        updateItemDto.user = user;
        //updateItemDto.unit = hasItem.unit;

        updateItemDto.unit = hasItem.unit - updateItemDto.unit;
        updateItemDto.user = user;
        if(updateItemDto.unit > 0) {
            updateItemDto.is_consumed = false;
        }
        else if(updateItemDto.unit == 0)
        {
            updateItemDto.is_consumed = true;
            this.warehouseRepository.delete(hasItem.id);
        }
        else{
            throw new NotAcceptableException("Depoda eksi miktarda ürün borçlanmayı gösterir.");
        }
        updateItemDto.updated_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();

        await this.warehouseRepository.update(hasItem.id, updateItemDto);
    }

    async correctItem(id: number, updateItemDto: UpdateItemDto, user: Users) {
        const hasItem = await this.fetchSingleWarehouseItem(id);
        if(!hasItem) throw new NotFoundException(`"${id}" id'sine sahip bir ürün bulunamadı.`);

        updateItemDto.updated_at = null;
        updateItemDto.user = user;
        updateItemDto.updated_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
        updateItemDto.is_consumed = hasItem.is_consumed;
        await this.warehouseRepository.update(id, updateItemDto);


    }
    
}
