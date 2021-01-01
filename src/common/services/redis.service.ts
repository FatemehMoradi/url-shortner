import { ErrorMessages } from '../enums/errorMessages.enum';
import { Inject, Service } from 'typedi';
import { RedisClient } from 'redis';
import {Logger} from "./logger";
const log = new Logger();


@Service()
export class RedisService {
    constructor(
        @Inject('redisClient') private redisClient: RedisClient,
    ) {}

    public async getFromRedis(key: string): Promise<any> {
        return new Promise((resolve) => {
            this.redisClient.get(key, (err, result) => {
                if (err) {
                    log.error('getFromRedis error ', err);
                    throw ErrorMessages.REDIS_ERROR(400, 'Error in getFromredis');
                }
                log.debug('getFromRedis result ', result);
                return resolve(JSON.parse(result));
                // return resolve(result);
            });
        });
    }

    public async setInRedis(
        key: string,
        value: string,
    ): Promise<string | undefined> {
        return new Promise((resolve) => {
            this.redisClient.set(
                key,
                JSON.stringify(value),
                (err, result) => {
                    if (err) {
                        log.error('setInRedis error ', err);
                        throw ErrorMessages.REDIS_ERROR(500, 'Error in setInRedis');
                    }
                    resolve(result);
                },
            );
        });
    }

    public async setInRedisWithExTime(
        key: string,
        value: string,
        expirationTimeSeconds: number,
    ): Promise<string | undefined> {
        return new Promise((resolve) => {
            this.redisClient.setex(
                key,
                expirationTimeSeconds,
                JSON.stringify(value),
                (err, result) => {
                    if (err) {
                        log.error('setInRedis error ', err);
                        throw ErrorMessages.REDIS_ERROR(500, 'Error in setInRedis');
                    }
                    resolve(result);
                },
            );
        });
    }

    public async deleteFromRedis(key: string): Promise<any> {
        return new Promise((resolve) => {
            this.redisClient.del(key, (err, result) => {
                if (err) {
                    log.error('delFromRedis error ', err);
                    throw ErrorMessages.REDIS_ERROR(500, 'Error in deleteFromRedis');
                }
                resolve(result);
            });
        });
    }

}
