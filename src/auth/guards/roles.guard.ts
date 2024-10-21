import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGurds implements CanActivate {

    constructor(private reflactor: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredroles = this.reflactor.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredroles) return true;

        const request = context.switchToHttp().getRequest();

        const user = request.user;

        return matchRoles(requiredroles, user?.role);

    }
}

function matchRoles(requiredroles: string[], userRole: string) {
    return requiredroles.some((role: string) => userRole?.includes(role));
}