import { Log } from '$lib/core/services/logging';

export function withLogger(
  level: 'DEBUG' | 'INFO' | 'ERROR' | 'WARNING' = 'DEBUG'
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      Log[level](target.constructor.name, propertyKey, { args });
      const response = originalMethod.apply(this, args);

      if (response instanceof Promise) {
        response.then((r) => {
          Log[level](target.constructor.name, propertyKey, {
            args,
            response: r
          });
        });
      } else {
        Log[level](target.constructor.name, propertyKey, { args, response });
      }

      return response;
    };
    return descriptor;
  };
}
