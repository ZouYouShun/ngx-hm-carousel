import {
  AsyncPipe,
  DOCUMENT,
  isPlatformBrowser,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  EmbeddedViewRef,
  forwardRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  BehaviorSubject,
  bufferCount,
  filter,
  forkJoin,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

import { resizeObservable } from '@nghedgehog/core';

import { NgxHmCarouselItemDirective } from './ngx-hm-carousel-item.directive';
import { NgxHmCarouselBreakPointUp } from './ngx-hm-carousel.model';

@Component({
  selector: 'ngx-hm-carousel',
  templateUrl: './ngx-hm-carousel.component.html',
  styleUrls: ['./ngx-hm-carousel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxHmCarouselComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgTemplateOutlet, AsyncPipe],
})
export class NgxHmCarouselComponent implements ControlValueAccessor, OnDestroy {
  private platformId = inject<any>(PLATFORM_ID);
  private _document = inject<any>(DOCUMENT);
  private _destroyRef = inject<any>(DestroyRef);
  private _renderer = inject(Renderer2);
  private _zone = inject(NgZone);
  private _cd = inject(ChangeDetectorRef);
  container = viewChild.required('containerElm', { read: ElementRef });
  btnPrev = viewChild<ElementRef>('prev');
  btnNext = viewChild<ElementRef>('next');
  progressContainerElm = viewChild('progress', { read: ElementRef });

  // get all item elms
  itemElms = contentChildren(NgxHmCarouselItemDirective, {
    read: ElementRef,
    descendants: true,
  });

  contentPrev = contentChild('carouselPrev', { read: TemplateRef });
  contentNext = contentChild('carouselNext', { read: TemplateRef });
  dotElm = contentChild<TemplateRef<any>>('carouselDot');
  progressElm = contentChild<TemplateRef<any>>('carouselProgress');

  infiniteContainer = contentChild('infiniteContainer', {
    read: ViewContainerRef,
  });

  contentContent = contentChild.required('carouselContent', {
    read: TemplateRef,
  });

  /** the data you using with *ngFor, it need when infinite mode or autoplay mode */
  data = input<any[]>([]);

  /** when infinite is true, the animation time with item, default is 400. */
  aniTime = input(400);

  /** this class will add in #containerElm when model change */
  aniClass = input('transition');

  /**
   * this class will add when carousel auto play,
   * this default autoplay animation is same as aniClass
   */
  aniClassAuto = input(this.aniClass());

  /**
   * user move picture with the container width rate,
   * when more than that rate, it will go to next or prev,
   * set false will never move with distance rate,
   * default is `0.15`
   */
  panBoundary = input<number | false>(0.15, { alias: 'pan-boundary' });

  /** when `show-num` is bigger than 1, the first item align, default is `center` */
  align = input<'left' | 'center' | 'right'>('center');

  /**
   * disable when drag occur the child element will follow touch point.
   * default is `false`
   */
  notDrag = input(false, { alias: 'not-follow-pan' });

  /**
   * the event binding state for stop auto play when mouse move over
   */
  mouseEnable = input(false, { alias: 'mouse-enable' });

  /** each auto play between time */
  delay = input(8000, { alias: 'between-delay' });

  /** auto play direction, default is `right`. */
  direction = input<'left' | 'right'>('right', { alias: 'autoplay-direction' });

  /** how many number with each scroll, default is `1`. */
  scrollNum = input(1, { alias: 'scroll-num' });

  /** Could user scroll many item once, simulate with scrollbar, default is `false` */
  isDragMany = input(false, { alias: 'drag-many' });

  /** Minimal velocity required before recognizing, unit is in px per ms, default `0.3` */
  swipeVelocity = input(0.3, { alias: 'swipe-velocity' });

  /**
   * switch show number with custom logic like css
   * @media (min-width: `number`px)
   */
  breakpoint = input<NgxHmCarouselBreakPointUp[]>([]);

  /** disable drag event with touch and mouse pan moving, default is `false` */
  disableDrag = input(undefined, {
    alias: 'disable-drag',
    transform: (value: boolean) => {
      if (this.rootElm) {
        if (value) {
          this.destroyHammer();
        } else {
          this.hammer = this.bindHammer();
        }
      }
      return value;
    },
  });

  /** is the carousel can move infinite */
  infinite = input(false, {
    alias: 'infinite',
  });

  /** auto play speed */
  speed = input(undefined, {
    alias: 'autoplay-speed',
    transform: (value: number) => {
      this.speedChange.next(value);
      return value;
    },
  });

  /** PinchRecognizer that you want to add to hammer event */
  recognizers = input<Recognizer[]>([]);

  /** PinchRecognizer that you want to add to hammer event */
  stopPanListener = input(false);
  private _showNum = 1;
  /**
   * how many number items to show once, default is `1`
   * set `auto` to using `[breakpoint]` set value.
   */
  showNum = input(this._showNum, {
    alias: 'show-num',
    transform: (value: number | 'auto') => {
      if (value === 'auto') {
        this.isAutoNum = true;
      } else {
        this._showNum = +value;
        if (this.rootElm) {
          this.setViewWidth();
          this.reSetAlignDistance();
        }
      }

      return this._showNum;
    },
  });

  /** is that carousel auto play */
  autoplay = input(undefined, {
    alias: 'autoplay',
    transform: (value: boolean) => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.elms) {
          this.progressWidth = 0;
          if (value) {
            this.doNextSub$ = this.doNext$?.subscribe();
          } else {
            if (this.doNextSub$) {
              this.doNextSub$.unsubscribe();
            }
          }
        }
      }
      return value;
    },
  });

  get currentIndex() {
    return this._currentIndex;
  }
  set currentIndex(value) {
    // if now index is not equal to save index, do something
    if (this.currentIndex !== value) {
      // if the value is not contain with the boundary not handler
      if (
        !this.runLoop() &&
        !(0 <= value && value <= this.itemElms().length - 1)
      ) {
        return;
      }
      this._currentIndex = value;
      if (this.elms) {
        if (this.autoplay() && !this.isFromAuto) {
          this._zone.runOutsideAngular(() => {
            this.stopEvent.next(undefined);
            this.callRestart();
          });
        }
        this.drawView(this.currentIndex, this.hasInitWriteValue);
        if (this.isDragMany()) {
          this.hasInitWriteValue = true;
        }
      }
      if (
        0 <= this.currentIndex &&
        this.currentIndex <= this.itemElms().length - 1
      ) {
        this._zone.run(() => {
          this.onChange(this.currentIndex);
          this._cd.detectChanges();
        });
      }
    }
    this.isFromAuto = false;
  }

  get progressWidth() {
    return this._progressWidth;
  }
  set progressWidth(value) {
    const containerElm = this.progressContainerElm();
    if (this.progressElm() && containerElm && this.autoplay()) {
      this._progressWidth = value;
      this._renderer.setStyle(
        (containerElm.nativeElement as HTMLElement).children[0],
        'width',
        `${this.progressWidth}%`,
      );
    }
  }

  get grabbing() {
    return this._grabbing;
  }
  set grabbing(value: boolean) {
    if (this._grabbing !== value) {
      // console.log(value);
      this._zone.run(() => {
        this._grabbing = value;
        if (value) {
          this._renderer.addClass(this.containerElm, 'grabbing');
        } else {
          this.panCount = 0;
          this.callRestart();
          this._renderer.removeClass(this.containerElm, 'grabbing');
        }
        this._cd.detectChanges();
      });
    }
  }

  // using for check mouse or touchend
  leaveObs$ = merge(
    fromEvent<MouseEvent>(this._document, 'mouseup'),
    fromEvent<TouchEvent>(this._document, 'touchend'),
  ).pipe(
    tap((e: Event) => {
      this.grabbing = false;
      e.stopPropagation();
      e.preventDefault();
    }),
  );

  hammer!: HammerManager | null;

  private set left(value: number) {
    if (isPlatformBrowser(this.platformId)) {
      this._renderer.setStyle(
        this.containerElm,
        'transform',
        `translateX(${value}px)`,
      );
    } else {
      this._renderer.setStyle(
        this.containerElm,
        'transform',
        `translateX(${value}%)`,
      );
    }
  }

  private get maxRightIndex() {
    let addIndex = 0;
    switch (this.align()) {
      case 'left':
        addIndex = 0;
        break;
      case 'center':
        addIndex = (this.showNum() as number) - 1;
        break;
      case 'right':
        addIndex = (this.showNum() as number) - 1;
        break;
    }
    return this.itemElms().length - 1 - this._showNum + 1 + addIndex;
  }

  runLoop = computed(() => this.autoplay() || this.infinite());

  private get lengthOne() {
    return this.itemElms().length === 1;
  }

  private get rootElmWidth() {
    return isPlatformBrowser(this.platformId)
      ? this.rootElm.getBoundingClientRect().width
      : 100;
  }

  private set containerElmWidth(value: number) {
    this.setStyle(this.containerElm, 'width', value);
  }

  private isFromAuto = true;
  private isAutoNum = false;
  private mouseOnContainer = false;
  private alignDistance = 0;
  private elmWidth = 0;

  private rootElm!: HTMLElement;
  private containerElm!: HTMLElement;

  private elms!: Array<HTMLElement>;
  private infiniteElmRefs = signal<Array<EmbeddedViewRef<any>>>([]);

  private saveTimeOut$?: Subscription;
  private doNextSub$?: Subscription;
  private doNext$?: Observable<any>;

  private restart = new BehaviorSubject<any>(null);
  private speedChange = new BehaviorSubject(5000);
  private stopEvent = new Subject<any>();

  private _progressWidth = 0;
  private _currentIndex = 0;
  private _grabbing = false;

  private panCount = 0;

  // this variable use for check the init value is write with ngModel,
  // when init first, not set with animation
  private hasInitWriteValue = false;

  protected readonly itemElmsChanges = toObservable(this.itemElms);

  constructor() {
    effect(() => {
      this.infiniteElmRefs().forEach((ref) => {
        this.addStyle(ref.rootNodes[0], {
          visibility: this.runLoop() ? 'visible' : 'hidden',
        });
      });
    });

    const effectRef = effect(
      () => {
        this.rootElm = this.container().nativeElement;
        this.containerElm = this.rootElm.children[0] as HTMLElement;

        this.init();

        forkJoin([
          this.bindClick(),
          // when item changed, remove old hammer binding, and reset width
          this.itemElmsChanges.pipe(
            // detectChanges to change view dots
            tap(() => {
              if (this.currentIndex > this.itemElms().length - 1) {
                // pass the change detection check,
                requestAnimationFrame(() => {
                  this.currentIndex = this.itemElms().length - 1;
                });
              }
              this.destroy();
              this.removeInfiniteElm();
              this.init();
              this.progressWidth = 0;
            }),
            tap(() => this._cd.detectChanges()),
          ),
          resizeObservable(this.rootElm, () => this.containerResize()),
        ])
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe();

        // only exec once
        effectRef.destroy();
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  ngOnDestroy() {
    this.destroy();
  }

  writeValue(value: any) {
    if (value || value === 0) {
      this.currentIndex = value;
      this.hasInitWriteValue = true;
    }
  }

  registerOnChange(fn: (value: any) => any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any) {
    this.onTouched = fn;
  }

  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  private init() {
    this.initVariable();
    this.setViewWidth(true);
    this.reSetAlignDistance();
    if (!this.disableDrag()) {
      this.hammer = this.bindHammer();
    }
    this.drawView(this.currentIndex, false);
    if (isPlatformBrowser(this.platformId) && this.runLoop()) {
      this.addInfiniteElm();
    }
  }

  private destroy() {
    this.destroyHammer();

    if (this.autoplay()) {
      this.doNextSub$?.unsubscribe();
    }
  }

  private destroyHammer() {
    if (this.hammer) {
      this.hammer.destroy();
    }
  }

  private addInfiniteElm() {
    const infiniteContainer = this.infiniteContainer();
    const showNum = this.showNum();

    if (!infiniteContainer || typeof showNum !== 'number') return;
    for (let i = 1; i <= showNum; i++) {
      const elm = infiniteContainer.createEmbeddedView(this.contentContent(), {
        $implicit: this.data()[this.itemElms().length - i],
        index: this.itemElms().length - i,
      });
      this.addStyle(elm.rootNodes[0], {
        position: 'absolute',
        // boxShadow: `0 0 0 5000px rgba(200, 75, 75, 0.5) inset`,
        transform: `translateX(-${100 * i}%)`,
        visibility: this.runLoop() ? 'visible' : 'hidden',
      });
      this.setStyle(elm.rootNodes[0], 'width', this.elmWidth);

      const elm2 = infiniteContainer.createEmbeddedView(this.contentContent(), {
        $implicit: this.data()[i - 1],
        index: i - 1,
      });
      this.addStyle(elm2.rootNodes[0], {
        // boxShadow: `0 0 0 5000px rgba(200, 75, 75, 0.5) inset`,
        position: 'absolute',
        right: 0,
        top: 0,
        transform: `translateX(${100 * i}%)`,
        visibility: this.runLoop() ? 'visible' : 'hidden',
      });
      this.setStyle(elm2.rootNodes[0], 'width', this.elmWidth);

      elm.detectChanges();
      elm2.detectChanges();

      this.infiniteElmRefs.set([...this.infiniteElmRefs(), elm, elm2]);
    }
  }

  private removeInfiniteElm() {
    this.infiniteElmRefs().forEach((a) => {
      a.detach();
      a.destroy();
    });
    if (this.infiniteContainer()) {
      this.infiniteContainer()!.clear();
    }
    this.infiniteElmRefs.set([]);
  }

  private containerResize() {
    this.setViewWidth();
    this.reSetAlignDistance();

    const showNum = this.showNum();
    const touchEnd = typeof showNum === 'number' && showNum >= this.elms.length;

    if (this.align() !== 'center' && touchEnd) {
      this.currentIndex = 0;
    }

    this.drawView(this.currentIndex, false);
  }

  private initVariable() {
    this._zone.runOutsideAngular(() => {
      this.elms = this.itemElms().map((x) => x.nativeElement);

      let startEvent = this.restart.asObservable();
      let stopEvent = this.stopEvent.asObservable();
      if (this.mouseEnable()) {
        startEvent = merge(
          startEvent,
          fromEvent(this.containerElm, 'mouseleave').pipe(
            // when leave, we should reverse grabbing state to set the mouseOn state,
            // because when the grabbing, the mask will on, and it will occur leave again
            filter(() => !this.grabbing),
            tap(() => (this.mouseOnContainer = false)),
          ),
        );
        stopEvent = merge(
          stopEvent,
          fromEvent(this.containerElm, 'mouseover').pipe(
            tap(() => (this.mouseOnContainer = true)),
          ),
        );
      }

      this.doNext$ = startEvent.pipe(
        // not using debounceTime, it will stop mouseover event detect, will cause mouse-enable error
        // debounceTime(this.delay),
        switchMap(() => this.speedChange),
        switchMap(() =>
          timer(this.delay()).pipe(
            switchMap(() => this.runProgress(20)),
            tap(() => {
              this.isFromAuto = true;
              // console.log('next');
              if (this.direction() === 'left') {
                this.currentIndex -= this.scrollNum();
              } else {
                this.currentIndex += this.scrollNum();
              }
            }),
            takeUntil(stopEvent.pipe(tap(() => (this.progressWidth = 0)))),
          ),
        ),
      );

      if (this.autoplay()) {
        this.doNextSub$ = this.doNext$.subscribe();
      }
    });
  }

  private reSetAlignDistance() {
    switch (this.align()) {
      case 'center':
        this.alignDistance = (this.rootElmWidth - this.elmWidth) / 2;
        break;
      case 'left':
        this.alignDistance = 0;
        break;
      case 'right':
        this.alignDistance = this.rootElmWidth - this.elmWidth;
        break;
    }
  }

  private setViewWidth(isInit?: boolean) {
    if (this.isAutoNum) {
      this._showNum = this.getAutoNum();
    }
    this._renderer.addClass(this.containerElm, 'grab');
    if (isInit) {
      // remain one elm height
      this._renderer.addClass(
        this.containerElm,
        'ngx-hm-carousel-display-nowrap',
      );
    }
    this.elmWidth = this.rootElmWidth / this._showNum;

    this._renderer.removeClass(
      this.containerElm,
      'ngx-hm-carousel-display-nowrap',
    );

    this.containerElmWidth = this.elmWidth * this.elms.length;

    this._renderer.setStyle(this.containerElm, 'position', 'relative');

    this.infiniteElmRefs().forEach((ref) => {
      this.setStyle(ref.rootNodes[0], 'width', this.elmWidth);
    });
    this.elms.forEach((elm: HTMLElement) => {
      this.setStyle(elm, 'width', this.elmWidth);
    });
  }

  private bindHammer() {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return this._zone.runOutsideAngular(() => {
      const hm = new Hammer.Manager(this.containerElm);

      const pan = new Hammer.Pan({
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold: 0,
      });

      hm.add(pan);

      hm.on('panleft panright panend pancancel', (e: HammerInput) => {
        // console.log(e.type);

        if (this.stopPanListener()) {
          return;
        }

        if (this.lengthOne) {
          return;
        }

        this.removeContainerTransition();

        if (this.autoplay()) {
          this._zone.runOutsideAngular(() => {
            this.stopEvent.next(undefined);
          });
        }

        switch (e.type) {
          case 'panleft':
          case 'panright':
            {
              this.panCount++;
              // only when panmove more than two times, set move
              if (this.panCount < 2) {
                return;
              }

              this.grabbing = true;
              const showNum = this.showNum();
              // When show-num is bigger than length, stop hammer
              if (
                this.align() !== 'center' &&
                typeof showNum === 'number' &&
                showNum >= this.elms.length
              ) {
                this.hammer?.stop(true);
                return;
              }
              // Slow down at the first and last pane.
              if (!this.runLoop() && this.outOfBound(e.type)) {
                e.deltaX *= 0.2;
              }

              if (!this.notDrag()) {
                this.left =
                  -this.currentIndex * this.elmWidth +
                  this.alignDistance +
                  e.deltaX;
              }

              //  if not drag many, when bigger than half
              if (!this.isDragMany()!) {
                if (Math.abs(e.deltaX) > this.elmWidth * 0.5) {
                  if (e.deltaX > 0) {
                    this.currentIndex -= this.scrollNum();
                  } else {
                    this.currentIndex += this.scrollNum();
                  }
                  this.hammer?.stop(true);
                  return;
                }
              }
            }
            break;
          case 'pancancel':
            this.drawView(this.currentIndex);
            break;

          case 'panend':
            {
              const panBoundary = this.panBoundary();
              // if boundary more than rate
              if (
                panBoundary !== false &&
                Math.abs(e.deltaX) > this.elmWidth * panBoundary
              ) {
                const moveNum = this.isDragMany()
                  ? Math.ceil(Math.abs(e.deltaX) / this.elmWidth)
                  : this.scrollNum();

                const prevIndex = this.currentIndex - moveNum;
                const nextIndex = this.currentIndex + moveNum;

                // if right
                if (e.deltaX > 0) {
                  this.goPrev(prevIndex);
                  // left
                } else {
                  this.goNext(nextIndex);
                }
                break;
              } else if (
                e.velocityX < -this.swipeVelocity() &&
                e.distance > 10
              ) {
                this.goNext(this.currentIndex + this.scrollNum());
              } else if (
                e.velocityX > this.swipeVelocity() &&
                e.distance > 10
              ) {
                this.goPrev(this.currentIndex - this.scrollNum());
              } else {
                this.drawView(this.currentIndex);
              }
            }
            break;
        }
      });

      this.recognizers().forEach((recognizer) => {
        hm.add(recognizer);
      });

      return hm;
    });
  }

  private goPrev(prevIndex: number) {
    if (!this.runLoop() && prevIndex < 0) {
      prevIndex = 0;
      this.drawView(0);
    }
    this.currentIndex = prevIndex;
  }

  private goNext(nextIndex: number) {
    if (!this.runLoop() && nextIndex > this.maxRightIndex) {
      nextIndex = this.maxRightIndex;
      this.drawView(nextIndex);
    }
    this.currentIndex = nextIndex;
  }

  private bindClick() {
    const nextBtn = this.btnNext();
    const prevBtn = this.btnPrev();
    if (nextBtn && prevBtn) {
      return forkJoin([
        fromEvent(nextBtn.nativeElement, 'click').pipe(
          tap(() => this.currentIndex++),
        ),
        fromEvent(prevBtn.nativeElement, 'click').pipe(
          tap(() => this.currentIndex--),
        ),
      ]);
    }
    return of(null);
  }

  private callRestart() {
    // if that is autoplay
    // if that mouse is not on container( only mouse-enable is true, the state maybe true)
    // if now is grabbing, skip this restart, using grabbing change restart
    if (this.autoplay()! && !this.mouseOnContainer && !this.grabbing) {
      this._zone.runOutsideAngular(() => {
        this.restart.next(null);
      });
    }
  }

  private drawView(
    index: number,
    isAnimation = true,
    isFromAuto = this.isFromAuto,
  ) {
    // move element only on length is more than 1
    if (this.elms.length > 1) {
      this.removeContainerTransition();
      this.left = -(index * this.elmWidth - this.alignDistance);

      if (isAnimation) {
        if (isFromAuto) {
          this._renderer.addClass(this.containerElm, this.aniClassAuto());
        } else {
          this._renderer.addClass(this.containerElm, this.aniClass());
        }
        // if infinite move to next index with timeout
        this.infiniteHandler(index);
      }
    } else {
      this.left = this.alignDistance;
    }
  }

  private removeContainerTransition() {
    this._renderer.removeClass(this.containerElm, this.aniClass());
    this._renderer.removeClass(this.containerElm, this.aniClassAuto());
  }

  private infiniteHandler(index: number) {
    if (this.runLoop()) {
      let state = 0;
      state = index < 0 ? -1 : state;
      state = index > this.itemElms().length - 1 ? 1 : state;

      // index = index % this._showNum;
      if (state !== 0) {
        switch (state) {
          case -1:
            this._currentIndex =
              (this.itemElms().length + index) % this.itemElms().length;
            break;
          case 1:
            this._currentIndex = index % this.itemElms().length;
            break;
        }

        const isFromAuto = this.isFromAuto;
        if (this.saveTimeOut$) {
          this.saveTimeOut$.unsubscribe();
        }

        this.saveTimeOut$ = timer(this.aniTime())
          .pipe(
            switchMap(() => {
              // if it is any loop carousel, the next event need wait the timeout complete
              if (this.aniTime() === this.speed()) {
                this.removeContainerTransition();
                this.left =
                  -((this._currentIndex - state) * this.elmWidth) +
                  this.alignDistance;
                return timer(50).pipe(
                  tap(() => {
                    this.drawView(
                      this.currentIndex,
                      this.hasInitWriteValue,
                      isFromAuto,
                    );
                  }),
                );
              } else {
                this.drawView(this.currentIndex, false);
              }
              return of(null);
            }),
            takeUntil(this.stopEvent),
          )
          .subscribe();
      }
    }
  }

  private outOfBound(type: 'panleft' | 'panright') {
    switch (type) {
      case 'panleft':
        return this.currentIndex >= this.maxRightIndex;
      case 'panright':
        return this.currentIndex <= 0;
    }
  }

  private runProgress(betweenTime: number): Observable<any> {
    return this._zone.runOutsideAngular(() => {
      const speed = this.speed()!;
      const howTimes = speed / betweenTime;
      const everyIncrease = (100 / speed) * betweenTime;
      return interval(betweenTime).pipe(
        tap((t) => {
          this.progressWidth = (t % howTimes) * everyIncrease;
        }),
        bufferCount(howTimes),
      );
    });
  }

  private getAutoNum() {
    const currWidth = this.rootElmWidth;
    // check user has had set breakpoint
    if (this.breakpoint().length > 0) {
      // get the last biggest point
      const now = this.breakpoint().find((b) => {
        return b.width >= currWidth;
      });
      // if find value, it is current width
      if (now) {
        return now.number;
      }
      return this.breakpoint()[this.breakpoint().length - 1].number;
    }

    // system init show number
    const initNum = 3;
    // 610
    if (currWidth > 300) {
      return Math.floor(initNum + currWidth / 200);
    }
    return initNum;
  }

  private addStyle(
    elm: HTMLElement,
    style: { [key: string]: string | number },
  ) {
    if (style) {
      Object.keys(style).forEach((key) => {
        const value = style[key];
        this._renderer.setStyle(elm, key, value);
      });
    }
  }

  private setStyle(elm: HTMLElement, style: string, value: number) {
    if (isPlatformBrowser(this.platformId)) {
      this._renderer.setStyle(elm, style, `${value}px`);
    } else {
      this._renderer.setStyle(elm, style, `${value}%`);
    }
  }
}
