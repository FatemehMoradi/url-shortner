import {Action} from 'routing-controllers';
import {Logger} from '../common/services/logger';
import {AppRole} from "../common/enums/appRole.enum";
import {Container} from "typedi";
import {UserRepository} from "../repositories/user.repository";
import {AuthService} from "../services/auth.service";
import {ErrorMessages} from "../common/enums/errorMessages.enum";
import {AuthType} from "../common/enums/authType.enum";

export function authorizationChecker(/*connection: Connection*/): (action: Action, roles: any[]) => Promise<boolean> | boolean {

    const log = new Logger(__filename);
    const authService = Container.get<AuthService>(AuthService);
    const userRepository = Container.get<UserRepository>(UserRepository);

    return async function innerAuthorizationChecker(
        action: Action,
        roles: string[],
    ): Promise<boolean> {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        const authorization = action.request.headers.authorization;
        if (authorization) {
            const [authType, token] = authorization.split(' ');
            // if (authType.toLowerCase() === AuthType.BASIC && roles.includes(AppRole.CHECK_BASIC) ) {}
            if (authType.toLowerCase() === AuthType.BEARER && roles.includes(AppRole.CHECK_BEARER)) {
                const payload = await authService.parseBearerAuthFromRequest(token);
                const userId = payload?.userInfo?.userId;
                const user = await userRepository.findByUserId(userId);

                if (user) {
                    action.request.user = user;
                } else {
                    throw ErrorMessages.INVALID_USER;
                }
            }
        } else {
            throw ErrorMessages.AUTHORIZATION_NOT_FOUND;
        }

        return true;
    };
}
