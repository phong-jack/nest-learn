import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string = 'BadRequest') {
    super('BadRequest', HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
