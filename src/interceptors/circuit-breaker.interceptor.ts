import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CircuitBreaker } from 'src/core/circuit.breaker';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  private readonly circuitBreakerByHandler = new WeakMap<
    Function,
    CircuitBreaker
  >();

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const methodRef = context.getHandler();

    let circuitBreakerConfig = this.reflector.get(
      'CIRCUIT_BREAKER_CONFIG_METAKEY',
      methodRef,
    );

    const { successThreshold, failureThreshold, openToHalfOpenWaitTime } =
      circuitBreakerConfig;

    let circuitBreaker: CircuitBreaker;
    if (this.circuitBreakerByHandler.has(methodRef)) {
      circuitBreaker = this.circuitBreakerByHandler.get(methodRef);
    } else {
      circuitBreaker = new CircuitBreaker(
        successThreshold,
        failureThreshold,
        openToHalfOpenWaitTime,
      );
      this.circuitBreakerByHandler.set(methodRef, circuitBreaker);
    }

    console.log('check circuit', circuitBreaker);
    return circuitBreaker.exec(next);
  }
}
