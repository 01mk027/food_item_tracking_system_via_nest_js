import { Injectable, ExecutionContext, Inject } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Logger } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";
import { CreateLoggerDto } from "../logger/create-logger.dto";


@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
    constructor(@Inject(LoggerService) private loggerService: LoggerService){
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const logger = new Logger();
        
        let ip = context.switchToHttp().getRequest().headers['x-forwarded-for'] || context.switchToHttp().getRequest().ip || context.switchToHttp().getRequest().connection.remoteAddress;
        logger.warn(`${ip} requested`);
        let loggerDto = new CreateLoggerDto();
        loggerDto.user = null;
        loggerDto.host = ip;
        loggerDto.transaction = "Giriş Denemesi";
        loggerDto.message = `${ip} li cihazdan giriş denemesi yapıldı`;
        loggerDto.type = "Giriş Denemesi";
        await this.loggerService.writeLog(loggerDto);
        console.log(context.switchToHttp().getRequest().ip);
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        if(result === true){
            console.log("Giriş yapılmış");
        }
        else{
            console.log("başarısızsın! ama başarılısın!");
        }
        await super.logIn(request);
        return result;
    }
}