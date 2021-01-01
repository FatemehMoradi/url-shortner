import {IsNotEmpty, IsString} from 'class-validator';
import {ErrorMessages} from "../common/enums/errorMessages.enum";

export class UserSignUpDto {

    // TODO : seprate error message required/invalid
    @IsNotEmpty({
        message: ErrorMessages.INVALID_USERNAME.message,
    })
    @IsString({
        message: ErrorMessages.INVALID_USERNAME.message,
    })
    username: string;

    @IsNotEmpty({
        message: ErrorMessages.INVALID_PASSWORD.message,
    })
    @IsString({
        message: ErrorMessages.INVALID_PASSWORD.message,
    })
    password: string;

    name: string;
}
