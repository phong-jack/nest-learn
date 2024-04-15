import { HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ReasonPhrases } from 'http-status-codes';

interface SuccessResponseOptions {
  message: string;
  statusCode?: HttpStatus;
  reasonStatusCode?: ReasonPhrases;
  data?: object | [] | string;
}

export class SuccessResponse {
  constructor(private readonly options: SuccessResponseOptions) {}

  send(res: Response): Response {
    const responseObject = {
      message: this.options.message || ReasonPhrases.OK,
      status: this.options.statusCode || HttpStatus.OK,
      data: this.options.data || {},
    };
    return res.status(responseObject.status).json(responseObject);
  }
}
