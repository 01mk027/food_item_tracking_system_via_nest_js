import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Users } from "src/users/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    serializeUser(user: any, done: (err: Error, user: Users) => void) {
        done(null, user);
    }

    deserializeUser(payload: any, done: (err: Error, payload: any) => void) {
        done(null, payload);
    }
}