import {sign, verify} from "jsonwebtoken";
import {env} from "../../env";

export enum TOKEN_TYPES {
    REFRESH = 'refresh',
    BEARER = "bearer"

}

export const jwtGenerator = async (data: any, lifeTime: number): Promise<string> => {
    const jwt = sign(
        data,
        env.token.jwtSecret as string,
        {expiresIn: lifeTime});

    return jwt;
};

export const verifyJwt = async (jwtToken: string): Promise<any> => {
    const jwt = verify(jwtToken, env.token.jwtSecret as string);
    return jwt
};




