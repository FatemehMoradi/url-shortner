import * as dotenv from 'dotenv';
import * as path from 'path';
import * as pkg from '../package.json';
import {
    getOsEnv,
    getOsEnvOptional,
    getOsPath,
    getOsPaths,
    normalizePort,
    toBool,
    toNumber,
} from './common/envUtils';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
    path: path.join(
        process.cwd(),
        `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
    ),
});

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        dirs: {
            // migrations: getOsPaths('TYPEORM_MIGRATIONS'),
            // migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
            // entities: getOsPaths('TYPEORM_ENTITIES'),
            // entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
            controllers: getOsPaths('CONTROLLERS'),
            middlewares: getOsPaths('MIDDLEWARES'),
            interceptors: getOsPaths('INTERCEPTORS'),
            // subscribers: getOsPaths('SUBSCRIBERS'),
            // resolvers: getOsPaths('RESOLVERS'),
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    mongo: {
        host: getOsEnv('MONGO_HOST'),
        port: getOsEnv('MONGO_PORT'),
        username: getOsEnv('MONGO_USERNAME'),
        password: getOsEnv('MONGO_PASSWORD'),
        database: getOsEnv('MONGO_DB_NAME'),
    },
    redis: {
        host: getOsEnvOptional('REDIS_HOST'),
        database: getOsEnvOptional('REDIS_DB'),
        port: getOsEnvOptional('REDIS_PORT') ? toNumber(getOsEnvOptional('REDIS_PORT')) : undefined,
        password: getOsEnvOptional('REDIS_PASSWORD'),
        redisKey: getOsEnvOptional('REDISKEY'),
    },
    rabbitmq:{
        connectionString: getOsEnv('RABBIT_CONNECTION_STRING'),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    token: {
        bearerLifeTime: getOsEnv('BREAR_TOKEN_LIFE_TIME'),
        refreshLifeTime: getOsEnv('REFRESH_TOKEN_LIFE_TIME'),
        jwtSecret: getOsEnv('JWT_SECRET'),
    }
};
