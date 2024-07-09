/* 
interface CustomItemType {
    item: WarehouseItems;
    quantityPerPortion: number;
    unitPerPortion: string;
}

@Entity('recipe')
export class Recipe{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('simple-json')
    items: CustomItemType[];

    @ManyToMany(() => Users, {nullable: true, orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
    })
    @JoinColumn()
    user: Users;

    @Column({ name: 'description', type:'varchar', nullable: false })
    description: string;

    @Column({ name: 'created_at', nullable: true })
    created_at: string;

    @Column({ name: 'updated_at', nullable: true })
    updated_at: string;
}
*/

import { Users } from "../users/user.entity";
import { WarehouseItems } from "../warehouse_item/warehouse.entity";

interface CustomItemType {
    item_id: number;
    item_name: string;
    quantityPerPortion: number;
    unitPerPortion: string;
}



export class CreateRecipeDto{
    cook_name: string;
    items: CustomItemType[];
    user: Users;
    description: string;
    created_at: string;
    updated_at: string;
}