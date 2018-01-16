import { isPlatformBrowser } from '@angular/common';
export function onlyOnBrowser(variableId) {
  return function (target, key, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      if (isPlatformBrowser(this[variableId])) {
        return originalMethod.apply(this, args);
      }
    };
    return descriptor;
  };
}
