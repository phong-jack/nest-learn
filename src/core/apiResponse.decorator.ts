import { HttpStatus, SetMetadata } from '@nestjs/common';

export interface ResponseOptions {
  message: string;
  statusCode?: HttpStatus;
}

export const ApiCustomResponse = (options: ResponseOptions) =>
  SetMetadata('customResponse', options);
