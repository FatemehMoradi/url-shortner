import { Action } from 'routing-controllers';

export function currentUserChecker(): (action: Action) => Promise<any | undefined> {
    return async function innerCurrentUserChecker(action: Action): Promise<any | undefined> {
        return action.request.user;
    };
}
