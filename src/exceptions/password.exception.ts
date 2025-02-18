import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
