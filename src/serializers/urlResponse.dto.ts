import {IsNotEmpty, IsOptional} from 'class-validator';

export class UrlResponseDto {
    @IsNotEmpty({
        // message: ErrorMessages.AMOUNT_INPUT_NOT_VALID.message,
    })
    originalUrl: string;

    @IsNotEmpty()
    shortUrl: string;
}
