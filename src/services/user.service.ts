import {Service} from 'typedi';
import {ErrorMessages} from "../common/enums/errorMessages.enum";
import {Logger} from '../common/services/logger';
import {UserLoginDto} from "../serializers/userLogin.dto";
import {UserSignUpDto} from "../serializers/userSignUp.dto";
import {jwtGenerator, TOKEN_TYPES} from "../common/services/jwt.service";
import {UserRepository} from "../repositories/user.repository";
import {createHash, randomBytes} from "crypto";
import {env} from "../env";
import {v4} from "uuid";

const log = new Logger(__filename);


@Service()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) {
    }

    async signUp(signUpData: UserSignUpDto): Promise<any> {
        try {
            const {username, password} = signUpData;

            const user = await this.userRepository.findByUsername(username);
            if (user) {
                throw ErrorMessages.DUPLICATE_USERNAME;
            }

            const {salt, digest} = UserService.generatePassword(password);
            const newUser = {
                userId: v4(),
                username,
                password: digest,
                salt
            };
            await this.userRepository.createUser(newUser);
            return 'ok'

        } catch (e) {
            throw e;
        }
    }

    async login(loginData: UserLoginDto): Promise<any> {
        const {username, password} = loginData;

        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw ErrorMessages.INVALID_USERNAME_OR_PASSWORD;
        }

        const equalPassword = UserService.checkPassword(user.salt, user.password, password);
        if (!equalPassword) {
            throw ErrorMessages.INVALID_USERNAME_OR_PASSWORD;
        }

        const tokenData = await UserService.createJwtAccessToken(
            {userId: user.userId, username: user.username},
            env.token.bearerLifeTime as string,
            env.token.refreshLifeTime as string
        );

        return tokenData
    }

    static generatePassword(password: string) {
        let salt = randomBytes(8).toString('base64');
        let hash = createHash('sha256');
        hash.update(password + salt, 'utf8');
        let digest = hash.digest('base64');
        return {salt, digest}
    }

    static checkPassword(userSalt: string, hashedPassword: string, enteredPassword: string) {
        const hash = createHash('sha256');
        hash.update(enteredPassword + userSalt, 'utf8');
        const digest = hash.digest('base64');
        return (hashedPassword as string === digest as string)
    };

    static async createJwtAccessToken(userInfo: { userId: string, username: string }, brearTokenLifeTime: string, refreshTokenLifeTime: string): Promise<any> {
        const brearTokenLifeTimeInNumber = Number(brearTokenLifeTime);
        const refreshTokenLifeTimeInNumber = Number(refreshTokenLifeTime);
        const accessToken = await jwtGenerator({userInfo, tokenType: TOKEN_TYPES.BEARER}, brearTokenLifeTimeInNumber);
        const refreshToken = await jwtGenerator({
            userInfo,
            tokenType: TOKEN_TYPES.REFRESH
        }, refreshTokenLifeTimeInNumber);
        log.debug(accessToken, refreshToken, brearTokenLifeTimeInNumber);
        return {accessToken, refreshToken, lifeTime: refreshTokenLifeTimeInNumber}
    }

}
