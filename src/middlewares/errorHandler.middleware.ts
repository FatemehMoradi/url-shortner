import { Request, Response, NextFunction } from 'express';
import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';
import { env } from '../env';
import {Logger} from '../common/services/logger';
import {CustomError} from "../common/errors/custom.error";
import {ErrorMessages} from "../common/enums/errorMessages.enum";
const log = new Logger(__filename);

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    public isProduction = env.isProduction;
    constructor() {}

    public error(error: CustomError, req: Request, res: Response, next: NextFunction): void
    {
        log.debug('ErrorHandlerMiddleware');

        /**
         * If error is not of CustomError type, log the error and
         * convert it to custom unknown error.
         */

        if (!(error instanceof CustomError)) {
            log.error(error);
            error = ErrorMessages.UNKNOWN_ERROR;
        }

        /**
         * Attach code for backward-compatibility with Boomcore
         * services.
         */

        let code;
        switch (error.httpCode) {
            case 400:
                code = 'VALIDATION_ERROR';
                break;
            case 401:
            case 403:
                code = 'UNAUTHORIZED';
                break;
            case 404:
                code = 'NOT_FOUND';
                break;
            case 409:
                code = 'DUPLICATE_DATA';
                break;
            default:
                code = 'SERVER_ERROR';
                break;
        }

        /* Send Error Response */

        res.status(error.httpCode || 500).json({
            status: 'FAILED',
            error: {
                errorCode: error.errorCode || 150000000,
                code,
                message: error.message,
            },
        });

        if (this.isProduction) {
            log.error(error.name, error.message);
        } else {
            log.error(error.name, error.stack);
        }
    }
}
