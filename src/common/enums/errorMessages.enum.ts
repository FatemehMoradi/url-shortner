import {CustomError} from '../errors/custom.error';

export class ErrorMessages {
    /* 4xx: Client Error */
    public static readonly INVALID_REQUESTED_STRING = new CustomError({
        httpCode: 400,
        errorGroup: '10001',
        message: 'رشته ارسالی نامعتبر است',
    });
    public static readonly INVALID_URL = new CustomError({
        httpCode: 400,
        errorGroup: '10002',
        message: 'آدرس ارسال شده نامعتبر است',
    });

    public static readonly INVALID_USERNAME = new CustomError({
        httpCode: 400,
        errorGroup: '10003',
        message: 'نام کاربری نامعتبر است',
    });
    public static readonly INVALID_USERNAME_OR_PASSWORD = new CustomError({
        httpCode: 400,
        errorGroup: '10004',
        message: 'نام کاربری یا رمز عبور نامعتبر است',
    });
    public static readonly DUPLICATE_USERNAME = new CustomError({
        httpCode: 400,
        errorGroup: '10005',
        message: 'نام کاربری تکراری است',
    });
    public static readonly INVALID_PASSWORD = new CustomError({
        httpCode: 400,
        errorGroup: '10006',
        message: 'رمز عبور نامعتبر است',
    });

    public static readonly INVALID_USER = new CustomError({
        httpCode: 400,
        errorGroup: '10007',
        message: 'کاربر معتبر نیست',
    });
    public static readonly URL_NOT_FOUND = new CustomError({
        httpCode: 400,
        errorGroup: '10008',
        message: 'آدرس پیدا نشد',
    });


    public static readonly AUTHORIZATION_NOT_FOUND = new CustomError({
        httpCode: 401,
        errorGroup: '10009',
        message: 'توکن ارسال نشده است',
    });

    public static readonly INVALID_AUTHORIZATION = new CustomError({
        httpCode: 401,
        errorGroup: '10010',
        message: 'توکن معتبر نیست',
    });

    public static readonly UNKNOWN_ERROR = new CustomError({
        httpCode: 500,
        errorGroup: '20000',
        message: 'خطای ناشناخته رخ داده است',
    });

    public static readonly REDIS_ERROR = (httpCode, message: string) => new CustomError({
        httpCode,
        errorGroup: '12000',
        message,
    });

    /* Error  */
    public static generalError = (status, message) => new CustomError({
        httpCode: status,
        errorGroup: '00000',
        message: message,
    });
}
