import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import * as moment from 'moment';
import { WarehouseItems } from 'src/warehouse_item/warehouse.entity';

enum UserRoles {
    admin = 1,
    user = 2
}


@Entity('users')
export class Users{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_name', length: 100, nullable: false, unique: true })
    username: string;

    @Column({ name: 'full_name', length: 180, nullable: false, unique: false })
    full_name: string;

    @Column({ name: 'address', length: 500, nullable: false, unique: false })
    address: string;

    @Column({ name: 'password', length: 15, nullable: false})
    password: string;

    @Column({ name: 'phone', length: 30, nullable: false, unique: true })
    phone: string;

    @Column({ name: 'mail', length: 120, nullable: false, unique: true })
    mail: string;

    @Column({ name: 'user_role', type:'int', enum: UserRoles, nullable: false })
    user_role: UserRoles; // 1 - Admin 2 - User

    @Column({ name: 'created_at', length: 35, nullable: true })
    created_at: string;

    @Column({ name: 'updated_at', length: 35, nullable: true })
    updated_at: string;

    @OneToMany(() => WarehouseItems, (item) => item.user, {
        cascade: true,
        eager: true
    })
    warehouseItems: WarehouseItems[];

    @Column({ name: 'is_suspended', type: 'tinyint', nullable: false })
    is_suspended: Boolean;

    @Column({ name: 'is_super_admin', type: 'tinyint', nullable: true })
    is_super_admin: Boolean;
}