import { IsInt, IsNotEmpty } from "class-validator";
import { inspect } from "util";
import * as moment from 'moment';

export class CreateUsersDto{

    @IsNotEmpty({ message: 'Kullanıcı adı boş olamaz' })
    username: string;

    @IsNotEmpty({ message: "Kullanıcı gerçek ismi boş olamaz." })
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

    //let dt =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
    created_at: string =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();

    is_suspended: boolean;

    is_super_admin: boolean;
}