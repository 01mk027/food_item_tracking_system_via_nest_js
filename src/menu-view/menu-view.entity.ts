import { Recipe } from "../recipe/recipe.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";


@Entity('menu-view')
export class MenuView {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('simple-json')
    recipes: Recipe[];

    @Column({ name: 'number_of_portions' })
    number_of_portions: number;

    @Column({ name: 'created_at' })
    created_at: string;
}
