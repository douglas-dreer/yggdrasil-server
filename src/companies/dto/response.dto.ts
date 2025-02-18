export class ResponseDto {
    code: number;
    message: string;
    localDateTime: Date;

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}