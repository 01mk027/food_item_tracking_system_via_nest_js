/*
    @Column({ name: 'item_name', length: 100, nullable: true, unique: true })
    item_name: string;

    @Column({ name: 'unit', nullable: false})
    unit: number;

    @Column({ type:'varchar', enum:Quantities, name: 'quantity', length: 30, nullable: false })
    quantity: string;

    @Column({ name: 'updated_at', length: 35, nullable: true })
    updated_at: string;
*/

import { IsNotEmpty, IsInt } from "class-validator";
import { Users } from "src/users/user.entity";
import { WarehouseItems } from "src/warehouse_item/warehouse.entity";

export class CreateUpdItemDto{

    item: WarehouseItems;

    @IsNotEmpty({ message: 'Ürün ismi boş olamaz' })
    item_name: string;

    @IsNotEmpty({ message: 'Ürün miktarı boş olamaz.' })
    @IsInt({ message: 'Ürün miktarı, sayı cinsinden girilmelidir.' })
    unit: number;

    @IsNotEmpty({ message: 'Ürün miktarının birimi boş olmamalıdır.' })
    quantity: string;

    @IsNotEmpty({ message: 'Tarih boş bırakılamaz' })
    updated_at: string;

    portion: number;
}

/*
item_name: string;
unit: number;
quantity: string;
updated_at: string;

*/