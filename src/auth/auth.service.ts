import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import {Request} from "express";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async verifyUser(username: string, password: string): Promise<Users>{
        const user = this.usersService.findByUsername(username);
        
        if(!user || (await user).password !== password){
            throw new UnauthorizedException("Kullanıcı adı veya şifreniz yanlış.");
        }
        
        
        
        return user;
    }
}
