import { IsNotEmpty, IsInt } from "class-validator";
import { Users } from "src/users/user.entity";

export class UpdateItemDto{

    user: Users;

    @IsNotEmpty({ message: 'Ürün ismi boş olamaz' })
    item_name: string;

    @IsNotEmpty({ message: 'Ürün miktarı boş olamaz.' })
    @IsInt({ message: 'Ürün miktarı, sayı cinsinden girilmelidir.' })
    unit: number;

    @IsNotEmpty({ message: 'Ürün miktarının birimi boş olmamalıdır.' })
    quantity: string;

    @IsNotEmpty({ message: 'Tarih boş bırakılamaz' })
    created_at: string;


    @IsNotEmpty({ message: 'Tarih boş bırakılamaz' })
    updated_at: string;

    @IsNotEmpty({ message: 'Ürünün tükenip tükenmediği belirtilmelidir.' })
    is_consumed: Boolean;

    portionNumber: number;
}

