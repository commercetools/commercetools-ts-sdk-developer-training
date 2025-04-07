import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestParamMalformedException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.BAD_REQUEST);
  }
}
