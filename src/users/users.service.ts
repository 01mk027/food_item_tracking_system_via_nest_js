/*
import { Injectable } from '@nestjs/common';

export interface User {
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly mockedUsers: User[] = [
    {
      username: 'Alice',
      password: 'pass',
    },
    {
      username: 'Bob',
      password: 'pass',
    },
  ];

  findByUsername(username: string): User | null {
    return this.mockedUsers.find((user) => user.username === username) ?? null;
  }
}
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './create-user.dto';
import { UpdateItemDto } from 'src/warehouse_item/update-item.dto';
import { UpdateUsersDto } from './update-user.dto';
import * as moment from 'moment';
import { create } from 'domain';

export interface User {
  username: string;
  password: string;
  is_suspended: boolean;
}


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ){

  }

  async fetchUsers(): Promise<Users[]>
  {
    //console.log(moment.default().format());
    
    return this.usersRepository.find();
  }

  async fetchSingleUser(id: number): Promise<Users>
  {
    const isUserFound = this.usersRepository.findOne({
      where: {
        id: id
      }
    });

    if(!isUserFound) {
      throw new NotFoundException(`"${id} idsi ile kayıtlı kullanıcu bulunamadı.`);
    }

    return isUserFound;
  }
  

  async findByUsername(username: string): Promise<Users>{
    return this.usersRepository.findOne({
      where: {
        username: username,
        is_suspended: false
      }
    })
  }

  async addUser(createusersDto: CreateUsersDto){
    /*
    
        @IsNotEmpty({ message: 'Kullanıcı adı boş olamaz' })
    username: string;

    @IsNotEmpty({ message: 'Şifre boş olamaz' })
    password: string;

    @IsNotEmpty({ message: 'Telefon numarası boş olamaz.' })
    phone: string;

    @IsNotEmpty({ message: 'E-posta boş olamaz.' })
    mail: string;

    @IsNotEmpty({ message: 'Kullanıcı rolü belirtilmelidir.' })
    user_role: number; // 1 - Admin 2 - User

    created_at: Date;
    */ 
    
    
    let { username, full_name, address, password, phone, mail, user_role, created_at, is_suspended, is_super_admin } = createusersDto;
    createusersDto.created_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
    if(!created_at)
    {
      created_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
    }

    if(!is_suspended)
    {
      is_suspended = false;
    }
    

    const user = this.usersRepository.save({
      username, full_name, address, password, phone, mail, user_role,  created_at, is_suspended, is_super_admin
    });
    return user; 
  }

  async updateUser(id: number, updateUsersDto: UpdateUsersDto){
    const hasItem = await this.fetchSingleUser(id);
    if(!hasItem){
      throw new NotFoundException(`"${id}" idsi ile kayıtlı kullanıcı bulunamadı.`);
    }
    //console.log(hasItem);
    if(!updateUsersDto.updated_at){
      updateUsersDto.updated_at = moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
    }
    await this.usersRepository.update(id, updateUsersDto);
  }

  async removeUser(id: number){
      const result = await this.usersRepository.delete(id);
      if(result.affected == 0){
          throw new NotFoundException(`"${id} idsi ile kayıtlı kullanıcı bulunamadı."`);
      }
      return {
        message: "Kullanıcı başarıyla silindi."
      }
  }



  async suspendUser(id: number, updatedItemDto: UpdateUsersDto){
    //username, full_name, address, password, phone, mail, user_role, created_at, is_suspended
      const suspendedUser = await this.fetchSingleUser(id);
      if(!suspendedUser){
        throw new NotFoundException("Kullanıcı bulunamadı.");
      }

      updatedItemDto.is_suspended = true;
      updatedItemDto.updated_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();


      if(!updatedItemDto.address){
        updatedItemDto.address = suspendedUser.address;
      }

      if(!updatedItemDto.full_name){
        updatedItemDto.full_name = suspendedUser.full_name;
      }

      if(!updatedItemDto.mail){
        updatedItemDto.mail = suspendedUser.mail;
      }

      if(!updatedItemDto.password){
        updatedItemDto.password = suspendedUser.password;
      }
 
      if(!updatedItemDto.phone){
        updatedItemDto.phone = suspendedUser.phone;
      }

      if(!updatedItemDto.updated_at){
        updatedItemDto.updated_at = suspendedUser.updated_at;
      }

      if(!updatedItemDto.user_role){
        updatedItemDto.user_role = suspendedUser.user_role;
      }

      if(!updatedItemDto.username)
      {
        updatedItemDto.username = suspendedUser.username;
      }

      if(!updatedItemDto.updated_at)
      {
          updatedItemDto.updated_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
      }

      
      await this.usersRepository.update(id, updatedItemDto).then(() => {
        return {"mesaj": "Kullanıcı hesabı askıya alındı.",
        "users": this.usersRepository.find()
      };
      });;
  }


  async unsuspendUser(id: number, updatedItemDto: UpdateUsersDto){
    //username, full_name, address, password, phone, mail, user_role, created_at, is_suspended
      const suspendedUser = await this.fetchSingleUser(id);
      if(!suspendedUser){
        throw new NotFoundException("Kullanıcı bulunamadı.");
      }

      updatedItemDto.is_suspended = false;
      updatedItemDto.updated_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();

      if(!updatedItemDto.address){
        updatedItemDto.address = suspendedUser.address;
      }

      if(!updatedItemDto.full_name){
        updatedItemDto.full_name = suspendedUser.full_name;
      }

      if(!updatedItemDto.mail){
        updatedItemDto.mail = suspendedUser.mail;
      }

      if(!updatedItemDto.password){
        updatedItemDto.password = suspendedUser.password;
      }
 
      if(!updatedItemDto.phone){
        updatedItemDto.phone = suspendedUser.phone;
      }

      if(!updatedItemDto.updated_at){
        updatedItemDto.updated_at = suspendedUser.updated_at;
      }

      if(!updatedItemDto.user_role){
        updatedItemDto.user_role = suspendedUser.user_role;
      }

      if(!updatedItemDto.username)
      {
        updatedItemDto.username = suspendedUser.username;
      }

      if(!updatedItemDto.updated_at)
      {
          updatedItemDto.updated_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
      }
      
      
      await this.usersRepository.update(id, updatedItemDto).then(() => {
        return {"mesaj": "Kullanıcı hesabı aktif edildi.",
        "users": this.usersRepository.find()
      };
      });
 

  }


  async retrieveUsers(){
    const users = await this.usersRepository
    .createQueryBuilder('users')
    .select('users.username')
    .distinct(true)
    .getRawMany();

    return users;
}
}
