import { WarehouseItems } from 'src/warehouse_item/warehouse.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/user.entity';

enum Quantities {
    kg = 'kg',
    lt = 'lt',
    tane = 'tane'
}


@Entity('logs')
export class LoggerEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, {nullable: true, orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
    })
    @JoinColumn()
    user: Users;

    @Column({ name: 'host', nullable: true })
    host: string;

    @Column({ name: 'transaction', nullable: true })
    transaction: string;
    
    @Column({ name: 'message', nullable: true })
    message: string;

    @Column({ name: 'type', nullable: true })
    type: string;

    @Column({ name: 'created_at', length: 35, nullable: true })
    created_at: string;
}