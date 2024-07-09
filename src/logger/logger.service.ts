import { Injectable } from '@nestjs/common';
import { Between, Equal, MoreThan, Repository } from 'typeorm';
import { LoggerEntity } from './logger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLoggerDto } from './create-logger.dto';
import * as moment from 'moment';
import { Users } from '../users/user.entity';

@Injectable()
export class LoggerService {
    constructor(
        @InjectRepository(LoggerEntity)
        private readonly loggerRepository: Repository<LoggerEntity>){

    }

    async writeLog(createLoggerDto: CreateLoggerDto){
        let { user, host, transaction, message, type, created_at } = createLoggerDto;
        created_at = null;
        created_at =  moment.default().format("YYYY-MM-DD HH:mm:ss").toString();
        
        const log_item = this.loggerRepository.create({
             host, transaction, message, type, created_at
        });
        log_item.user = user;
        await this.loggerRepository.save(log_item);
        return log_item;
    }

    
    async writeLogBetweenTwoDates(firstDate: string, secondDate: string){
        return this.loggerRepository.find({
            where: {
                created_at: Between(firstDate, secondDate)
            }
        })
    }

    async retrieveTransactionTypes(){
        
        const statuses = await this.loggerRepository
        .createQueryBuilder('logs')
        .select('logs.type')
        .distinct(true)
        .getRawMany();

        return statuses;
    }

    async retrieveLogsByType(type: string){
        let now = moment.default().format('YYYY-MM-DD HH:mm:ss').toString();
        //let beforeAWeek = moment.default().diff('YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        let beforeAWeek = moment.default().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss').toString();
        /*
        return this.loggerRepository.find({
            where: {
                created_at: Between(beforeAWeek.toString(), now.toString()),
                type: type
            }
        });
        */

        const query = this.loggerRepository
        .createQueryBuilder('logs')
        .where('logs.created_at BETWEEN :beforeAWeek AND :now', { beforeAWeek, now })
        .andWhere('logs.type = :type', {type});

        return query.getMany();
    }

    async retrieveLogsByUsername(username: string){
        let now = moment.default().format('YYYY-MM-DD HH:mm:ss').toString();
        //let beforeAWeek = moment.default().diff('YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        let beforeAWeek = moment.default().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss').toString();
        console.log('now = ', now);
        console.log('beforeAWeek = ', beforeAWeek);
        
        /*
        return this.loggerRepository.find({
            where: {
                user: {
                    username: username,
                    created_at: Between(beforeAWeek.toString(), now.toString())
                }
            }
        });
        */

        const query = this.loggerRepository
        .createQueryBuilder('logs')
        .leftJoinAndSelect('logs.user', 'user')
        .where('logs.created_at BETWEEN :beforeAWeek AND :now', { beforeAWeek, now });
  
      if (username) {
        query.andWhere('user.username = :username', { username });
      }
          return await query.getMany();
    }
    
}
