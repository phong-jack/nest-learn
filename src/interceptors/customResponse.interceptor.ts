import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReasonPhrases } from 'http-status-codes';
import { Observable, map } from 'rxjs';
import { ResponseOptions } from 'src/core/apiResponse.decorator';

@Injectable()
export class CustomResponeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const customResponse = this.reflector.get(
      'customResponse',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        return {
          message: customResponse?.message || ReasonPhrases.OK,
          statusCode: customResponse?.statusCode || HttpStatus.OK,
          data: data,
        };
      }),
    );
  }
}
