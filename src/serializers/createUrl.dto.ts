import {IsNotEmpty, IsOptional, IsString, IsUrl, Matches} from 'class-validator';
import {ErrorMessages} from "../common/enums/errorMessages.enum";

export class CreateUrlDto {

    // TODO : seprate error message required/invalid
    @IsNotEmpty({
        message: ErrorMessages.INVALID_URL.message,
    })
    @IsUrl({}, {
        message: ErrorMessages.INVALID_URL.message,
    })

    @Matches(/(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?/, {
        message: ErrorMessages.INVALID_URL.message,
    })
    originalUrl: string;

    @IsOptional()
    @IsString({
        message: ErrorMessages.INVALID_REQUESTED_STRING.message,
    })
    requestedString: string;
}
