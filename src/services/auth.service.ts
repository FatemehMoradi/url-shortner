import {ErrorMessages} from "../common/enums/errorMessages.enum";
import {Service} from "typedi";
import {verifyJwt} from "../common/services/jwt.service";


@Service()
export class AuthService {
    constructor() {
    }

    public parseBasicAuthFromRequest(token: string): { userId: string; secret: string } {
        const decodedBase64 = Buffer.from(token, 'base64').toString('ascii');
        const [userId, secret] = decodedBase64.split(':');
        if (userId && secret) {
            return {userId, secret};
        } else {
            throw ErrorMessages.INVALID_AUTHORIZATION;
        }
    }

    public async parseBearerAuthFromRequest(token: string): Promise<any> {
        const verifiedToken = await verifyJwt(token);
        console.log(verifiedToken);
        return verifiedToken;
    }
}
