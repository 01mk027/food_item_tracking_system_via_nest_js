import { MenuView } from "../menu-view/menu-view.entity";
import { Users } from "../users/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

interface CustomItemType {
    item_id: number;
    item_name: string;
    quantityPerPortion: number;
    unitPerPortion: string;
}

@Entity('recipe')
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'cook_name', unique: true })
    cook_name: string;

    @Column('simple-json')
    items: CustomItemType[];

    @ManyToMany(() => Users, {
        nullable: true,
        orphanedRowAction: 'delete',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn()
    user: Users;

    @Column({ name: 'description', type: 'varchar', nullable: false })
    description: string;

    @Column({ name: 'created_at', nullable: true })
    created_at: string;

    @Column({ name: 'updated_at', nullable: true })
    updated_at: string;

}
