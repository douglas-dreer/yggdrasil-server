import {HttpException, HttpStatus} from '@nestjs/common';

export class DuplicateDataException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST); // BAD_REQUEST é o status code para dados inválidos ou duplicados
    }
}
