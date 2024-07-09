import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthenticatedGuard implements CanActivate{
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        let ip = context.switchToHttp().getRequest().headers['x-forwarded-for'] || context.switchToHttp().getRequest().ip || context.switchToHttp().getRequest().connection.remoteAddress;
        
        return request.isAuthenticated();
        
    }
}