import ResizeObserver from 'resize-observer-polyfill';
import { Observable, Subscriber } from 'rxjs';
import { debounceTime, tap, finalize } from 'rxjs/operators';

/**
 * An observable creator for element resize.
 * @param elm the watch element.
 * @param cb when resize complete, call back function.
 * @param time resize emit time, default is 200
 */
export function resizeObservable(elm: HTMLElement, cb: () => void, time = 200): Observable<any> {
  let elmObserve$: ResizeObserver;
  return Observable.create((observer: Subscriber<any>) => {
    elmObserve$ = new ResizeObserver((entries, obs) => {
      observer.next(elmObserve$);
    });
    elmObserve$.observe(elm);
  }).pipe(
    debounceTime(time),
    tap(() => {
      cb();
    }),
    finalize(() => {
      elmObserve$.unobserve(elm);
      elmObserve$.disconnect();
    })
  );
}
