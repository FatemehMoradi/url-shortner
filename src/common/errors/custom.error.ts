export interface ICustomError {
    httpCode: number;
    message: string;
    errorGroup: string;
}

export class CustomError extends Error {
    public httpCode: number;
    public errorCode: number; // e.g. '140010001'

    constructor(error: ICustomError, description?: string) {
        super(description || error.message);
        this.name = 'CustomError';
        this.httpCode = error.httpCode;
        this.errorCode = Number(`1${error.httpCode || 500}${error.errorGroup || '00000'}`);

        /**
         * Starting from ES6, after extending from Error object, we need
         * to explicitly set its prototype. Otherwise, "instanceof"
         * operator won't work on this class.
         */
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
