import { WarehouseItems } from 'src/warehouse_item/warehouse.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

enum Quantities {
    kg = 'kg',
    lt = 'lt',
    tane = 'tane'
}


@Entity('updated_items')
export class UpdatedItems{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'item_name', length: 100, nullable: true, unique: false })
    item_name: string;

    @Column({ name: 'unit', type:'float', nullable: false})
    unit: number;

    @Column({ type:'varchar', enum:Quantities, name: 'quantity', length: 30, nullable: false })
    quantity: string;

    @Column({ name: 'updated_at', length: 35, nullable: true })
    updated_at: string;

    @Column({ name: 'portion' })
    portion: number;
}