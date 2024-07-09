import { IsInt, IsNotEmpty } from "class-validator";
import { inspect } from "util";
import { Users } from "./user.entity";

export class UpdateUsersDto{

    @IsNotEmpty({ message: 'Kullanıcı adı boş olamaz' })
    username: string;

    @IsNotEmpty({ message: "Gerçek isim alanı boş geçilemez." })
    full_name: string;

    address: string;

    @IsNotEmpty({ message: 'Şifre boş olamaz' })
    password: string;

    @IsNotEmpty({ message: 'Telefon numarası boş olamaz.' })
    phone: string;

    @IsNotEmpty({ message: 'E-posta boş olamaz.' })
    mail: string;

    @IsNotEmpty({ message: 'Kullanıcı rolü belirtilmelidir.' })
    user_role: number; // 1 - Admin 2 - User

    updated_at: string;

    is_suspended: boolean;

    is_super_admin: boolean;

}