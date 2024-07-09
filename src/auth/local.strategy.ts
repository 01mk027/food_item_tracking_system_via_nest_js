import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Users } from "src/users/user.entity";
import { Logger } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super();
    }

    async validate(username: string, password: string): Promise<Users>
    {
        const logger = new Logger();
        const user = this.authService.verifyUser(username, password);
        if(!user) {
            logger.error("Kullanıcı bulunamadı.");
            throw new  UnauthorizedException("Incorrect username or password");
        }
        return user;
    }
}