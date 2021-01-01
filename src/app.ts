import 'reflect-metadata';
import {createExpressServer} from 'routing-controllers';
import {useContainer} from 'routing-controllers';
import {Container} from "typedi";
import {authorizationChecker} from './auth/authorizationChecker';
import {env} from "./env";
import {Logger} from './common/services/logger';
import {initMongo} from "./common/loader/mongoLoader";
import {initRedis} from "./common/loader/redisLoader";
import {currentUserChecker} from "./auth/currentUserChecker";
import {initRabbit} from "./common/loader/rabbitLoader";

// import { currentUserChecker } from './auth/currentUserChecker';
useContainer(Container);

const expressApp = createExpressServer({
    // cors: true,
    // classTransformer: true,
    // routePrefix: env.app.routePrefix,
    // defaultErrorHandler: false,
    validation: false,

    controllers: env.app.dirs.controllers,
    middlewares: env.app.dirs.middlewares,
    // interceptors: env.app.dirs.interceptors,

    /**
     * Authorization features
     */
    authorizationChecker: authorizationChecker(),
    currentUserChecker: currentUserChecker(),
});

const log = new Logger(__filename);
if (!env.isTest) {
    initMongo();
    initRedis();
    // initRabbit();
    const server = expressApp.listen(env.app.port);

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                log.info('Server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedErrorHandler = (error) => {
        log.error(error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);


    const route = () => `${env.app.schema}://${env.app.host}:${env.app.port}`;
    log.info(``);
    log.info(`Aloha, your app is ready on ${route()}${env.app.routePrefix}`);
    log.info(`To shut it down, press <CTRL> + C at any time.`);
    log.info(``);
    log.info('-------------------------------------------------------');
    log.info(`Environment  : ${env.node}`);
    log.info(`Version      : ${env.app.version}`);
    log.info(``);
    log.info(`API Info     : ${route()}${env.app.routePrefix}`);
    if (env.swagger.enabled) {
        log.info(`Swagger      : ${route()}${env.swagger.route}`);
    }
}

