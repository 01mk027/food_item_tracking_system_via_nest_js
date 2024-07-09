import { Observable } from "rxjs";
import { Users } from "src/users/user.entity";

export class CreateLoggerDto {
    user: Users;
    host: string;
    transaction: string;
    message: string;
    type: string;
    created_at: string;
}