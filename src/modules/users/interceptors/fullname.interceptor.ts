import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

export class FullNameInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('Da vao interceptor full name');
    return next
      .handle()
      .pipe(
        map((data) =>
          data.map((user) => ({
            ...user,
            fullName: `${(user.firstName, user.lastName)}`,
          })),
        ),
      );
  }
}
