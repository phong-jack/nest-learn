import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { CircuitBreakerInterceptor } from './circuit-breaker.interceptor';

export function ApplyCircuitBreaker(config: {
  successThreshold: number;
  failureThreshold: number;
  openToHalfOpenWaitTime: number;
}): MethodDecorator {
  console.log('Check config', config);
  return applyDecorators(
    UseInterceptors(CircuitBreakerInterceptor),
    SetMetadata('CIRCUIT_BREAKER_CONFIG_METAKEY', config),
  );
}
