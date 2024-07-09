import { Users } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

enum Quantities {
    kg = 'kg',
    lt = 'lt',
    tane = 'tane'
}


@Entity('warehouse_items')
export class WarehouseItems{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'item_name', length: 100, nullable: true, unique: true })
    item_name: string;

    @Column({ name: 'unit', type:'float', nullable: false})
    unit: number;

    @Column({ type:'varchar', enum:Quantities, name: 'quantity', length: 30, nullable: false })
    quantity: string;

    @Column({ name: 'created_at', length: 35, nullable: false })
    created_at: string;

    @Column({ name: 'updated_at', length: 35, nullable: true })
    updated_at: string;

    @Column({ name:'is_consumed', type: 'tinyint' })
    is_consumed: Boolean;

    @ManyToOne(() => Users, (user) => user.warehouseItems, {
        orphanedRowAction: 'delete',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user:Users;
}