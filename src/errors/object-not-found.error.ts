import { HttpException, HttpStatus } from '@nestjs/common';

export class ObjectNotFoundException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.NOT_FOUND);
  }
}
