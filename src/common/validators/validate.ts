import { validateOrReject, ValidationError, ValidatorOptions } from 'class-validator';
import { ErrorMessages } from '../enums/errorMessages.enum';

export async function validate(body: any, validationOptions?: ValidatorOptions): Promise<void> {
    try {
        await validateOrReject(body, validationOptions);

    } catch (errors) {
        console.log('---validation errors--', errors);
        // const message = errors.map((err: ValidationError) => {
        //     return `(${Object.values(err.constraints).join(', ')})`;
        // }).join(', ');
        const message = Object.values(errors[0].constraints)[0];

        throw ErrorMessages.generalError(
            400,
            message
        );
    }
}
