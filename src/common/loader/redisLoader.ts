import {createClient, RedisClient} from 'redis';
import {env} from "../../env";
import {Logger} from "../services/logger";
import {Container} from "typedi";

const log = new Logger();

export const initRedis = () => {
    const redisConfig = {
        host: env.redis.host,
        db: env.redis.database || 0,
        port: env.redis.port,
        password: env.redis.password,
    };
    let redisClient: RedisClient | null;
    if (!redisClient) {
        redisClient = createClient(redisConfig);
        redisClient.on('error', (err) => {
            log.error('Error connecting to redis .. ' + err);
            throw new Error('Error connecting to redis .. ' + err);
        });
    }

    Container.set('redisClient', redisClient);
}

