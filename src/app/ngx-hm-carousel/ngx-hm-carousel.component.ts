import { fromEvent } from 'rxjs/observable/fromEvent';
import { interval } from 'rxjs/observable/interval';
import { bufferCount, debounceTime, tap, merge, switchMap, takeUntil } from 'rxjs/operators';

import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { ContentChildren } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { NgxHmCarouselItemDirective } from './ngx-hm-carousel-item.directive';
import { isPlatformBrowser } from '@angular/common';
import { onlyOnBrowser } from './only-on.browser';

// if the pane is paned .25, switch to the next pane.
const PANBOUNDARY = 0.15;

export enum NgxHmRUN_DIRECTION {
  LEFT = 'left',
  RIGHT = 'right'
}

@Component({
  selector: 'ngx-hm-carousel',
  templateUrl: './ngx-hm-carousel.component.html',
  styleUrls: ['./ngx-hm-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxHmCarouselComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  @ViewChild('parentChild') parentChild;
  @ViewChild('prev') private btnPrev: ElementRef;
  @ViewChild('next') private btnNext: ElementRef;
  @ContentChildren(NgxHmCarouselItemDirective) items: NgxHmCarouselItemDirective[];
  @ContentChild('carouselPrev') contentPrev: TemplateRef<any>;
  @ContentChild('carouselNext') contentNext: TemplateRef<any>;
  @ContentChild('carouselDot') dotElm: TemplateRef<any>;
  @ContentChild('carouselProgress') progressElm: TemplateRef<any>;

  @Input('infinite') infinite = false;
  @Input('mourse-enable') mourseEnable = false;
  @Input('autoplay-speed') speed = 5000;
  @Input('between-delay') delay = 8000;
  @Input('autoplay-direction') direction: NgxHmRUN_DIRECTION = NgxHmRUN_DIRECTION.RIGHT;
  private _showNum = 1;
  private isAutoNum = false;
  @Input('show-num')
  set showNum(value: number | 'auto') {
    if (value === 'auto') {
      this.isAutoNum = true;
      this._showNum = this.getWindowWidthToNum();
    } else {
      this._showNum = value;
    }
  }
  @Input('scroll-num') scrollNum = 1;
  @Input('drag-many') isDragMany = false;
  private _viewIndex = 0;
  @Input('current-index')
  set currentIndex(value) {
    this._viewIndex = value;
    if (this.itemsElm) {
      this.drawView(this._viewIndex);
    }
  }
  get currentIndex() {
    return this._viewIndex;
  }
  private _autoplay = false;
  @Input('autoplay')
  set autoplay(value) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.itemsElm) {
        this.progressWidth = 0;
        if (value) {
          this.sub$ = this.doNext.subscribe();
        } else {
          if (this.sub$) this.sub$.unsubscribe();
        }
      }
    }
    this._autoplay = value;
  }
  get autoplay() {
    return this._autoplay;
  }

  @Output('index-change') indexChanged = new EventEmitter();
  private _porgressWidth = 0;
  set progressWidth(value) {
    if (this.progressElm !== undefined && this.autoplay) {
      this._porgressWidth = value;
    }
  }
  get progressWidth() {
    return this._porgressWidth;
  }

  private rootElm: HTMLDivElement;
  private containerElm: HTMLDivElement;
  private itemsElm: Array<HTMLDivElement>;
  private hammer: HammerManager;
  private elmWidth = 0;

  private isInContainer = false;
  private restart = new BehaviorSubject<any>(null);
  private stopEvent = new Subject<any>();

  private mostRightIndex = 0;

  private doNext: Observable<any>;
  private sub$: Subscription;

  private prePanMove: boolean;
  public dots: Array<number>;
  private nextListener: () => void;
  private prevListener: () => void;

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.setViewWidth();
    this.drawView(this.currentIndex);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _renderer: Renderer2) { }

  @onlyOnBrowser('platformId')
  ngAfterContentInit(): void {
    this.initVariable();
  }

  @onlyOnBrowser('platformId')
  ngAfterViewInit() {
    this.setViewWidth(true);
    this.hammer = this.bindHammer();
    this.drawView(this.currentIndex);
    this.bindClick();
  }

  @onlyOnBrowser('platformId')
  ngOnDestroy() {
    if (this.btnNext && this.btnPrev) {
      this.nextListener();
      this.prevListener();
    }
    this.hammer.destroy();
    if (this.autoplay) {
      this.sub$.unsubscribe();
    }
  }

  private initVariable() {
    this.rootElm = this.parentChild.nativeElement;
    this.containerElm = this.rootElm.children[0] as HTMLDivElement;
    this.itemsElm = Array.from(this.containerElm.children) as HTMLDivElement[];

    this.mostRightIndex = this.itemsElm.length - this._showNum;
    if (this.dotElm) {
      this.dots = new Array(this.itemsElm.length - (this._showNum - 1)).map((x, i) => i);
    }

    let startEvent = this.restart.asObservable(); // .merge(this.mourseLeave); // .map(() => console.log('start'))
    let stopEvent = this.stopEvent.asObservable();
    if (this.mourseEnable) {
      const mourseOver = fromEvent(this.containerElm, 'mouseover').pipe(
        tap(() => this.isInContainer = true)
      );
      const mourseLeave = fromEvent(this.containerElm, 'mouseleave').pipe(
        tap(() => this.isInContainer = true)
      );

      startEvent = startEvent.pipe(
        merge(mourseLeave)
      );

      stopEvent = stopEvent.pipe(
        merge(mourseOver)
      );
    }
    // const debounceTime = this.delay < this.speed ? this.delay : this.delay - this.speed;
    this.doNext = startEvent.pipe(
      debounceTime(this.delay),
      switchMap(() =>
        this.runProgress(20).pipe(
          tap(() => {
            // console.log('next');
            if (this.direction === NgxHmRUN_DIRECTION.LEFT) this.currentIndex -= this.scrollNum;
            else this.currentIndex += this.scrollNum;
          }),
          takeUntil(
            stopEvent.pipe(
              tap(() => this.progressWidth = 0)
            )
          )
        )
      ));

    if (this.autoplay) {
      this.sub$ = this.doNext.subscribe();
    }
  }

  private setViewWidth(isInit?: boolean) {
    if (this.isAutoNum) {
      this._showNum = this.getWindowWidthToNum();
      this.mostRightIndex = this.itemsElm.length - this._showNum;
      if (this.dotElm) {
        this.dots = new Array(this.itemsElm.length - (this._showNum - 1)).map((x, i) => i);
      }
    }
    this._renderer.addClass(this.containerElm, 'grab');
    // when init check view has scroll bar
    const totalWidth = 0;
    if (isInit) {
      // remain one elm height
      this._renderer.addClass(this.containerElm, 'ngx-hm-carousel-display-npwrap');
    }
    this.elmWidth = (totalWidth + this.rootElm.clientWidth) / this._showNum;

    this._renderer.removeClass(this.containerElm, 'ngx-hm-carousel-display-npwrap');
    this._renderer.setStyle(this.containerElm, 'width', `${this.elmWidth * this.itemsElm.length}px`);
    this._renderer.setStyle(this.containerElm, 'position', 'relative');
    this.itemsElm.forEach((elm: HTMLDivElement, index) => {
      this._renderer.setStyle(elm, 'width', `${this.elmWidth}px`);
    });
  }

  private bindHammer() {
    const hm = new Hammer(this.containerElm);
    hm.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hm.on('panleft panright panend tap', (e: HammerInput) => {
      this._renderer.removeClass(this.containerElm, 'transition');
      this._renderer.addClass(this.containerElm, 'grabbing');
      if (this.autoplay) {
        this.stopEvent.next();
      }
      // console.log(e.type);
      switch (e.type) {
        case 'tap':
          this.callClick(e.center.x);
          this.callRestart();
          this._renderer.removeClass(this.containerElm, 'grabbing');
          break;
        case 'panend':
          this._renderer.removeClass(this.containerElm, 'grabbing');
        // tslint:disable-next-line:no-switch-case-fall-through
        case 'panleft':
        case 'panright':
          this.handlePan(e);
          break;
      }
    });

    return hm;
  }

  private bindClick() {
    if (this.btnNext && this.btnPrev) {
      this.nextListener = this._renderer.listen(this.btnNext.nativeElement, 'click', () => {
        this.setIndex(this.currentIndex + 1);
      });
      this.prevListener = this._renderer.listen(this.btnPrev.nativeElement, 'click', () => {
        this.setIndex(this.currentIndex - 1);
      });
    }
  }

  private callRestart() {
    if (this.autoplay && !this.isInContainer) {
      this.restart.next(null);
    }
  }

  private callClick(positionX) {
    const toIndex = this.currentIndex + Math.floor(positionX / this.elmWidth);
    Array.from(this.items)[toIndex].clickEvent.emit(toIndex);
  }

  private drawView(index: number) {
    this._renderer.addClass(this.containerElm, 'transition');
    if (this.autoplay || this.infinite) {
      this.playCycle(index);
    } else {
      this._viewIndex = Math.max(0, Math.min(index, this.mostRightIndex));
    }
    // this.containerElm.style.transform = `translate3d(${-this.currentIndex * this.elmWidth}px, 0px, 0px)`;
    this._renderer.setStyle(this.containerElm, 'left', `${-this.currentIndex * this.elmWidth}px`);
    this.indexChanged.emit(this.currentIndex);
  }

  private playCycle(index: any) {
    switch (this.direction) {
      case NgxHmRUN_DIRECTION.LEFT:
        if (index === -this.scrollNum) {
          this._viewIndex = this.mostRightIndex;
        } else if (index > this.mostRightIndex || index < 0) {
          this._viewIndex = 0;
        }
        break;
      case NgxHmRUN_DIRECTION.RIGHT:
        if (index === this.mostRightIndex + this.scrollNum) {
          this._viewIndex = 0;
        } else if (index < 0 || this._viewIndex >= this.mostRightIndex) {
          this._viewIndex = this.mostRightIndex;
        }
        break;
    }
  }

  private handlePan(e: HammerInput) {
    // console.log(e.deltaX / this.elmWidth);
    // console.log(moveNum);
    switch (e.type) {
      case 'panleft':
      case 'panright':
        // console.log(e.deltaY);
        this.prePanMove = false;
        if (Math.abs(e.deltaY) > 50) return;
        // Slow down at the first and last pane.
        if (this.outOfBound(e.type) && (!this.infinite)) {
          e.deltaX *= 0.5;
        }
        this._renderer.setStyle(this.containerElm, 'left', `${-this.currentIndex * this.elmWidth + e.deltaX}px`);

        if (!this.isDragMany) {
          if (Math.abs(e.deltaX) > this.elmWidth * 0.5) {
            if (e.deltaX > 0) {
              this.currentIndex -= this.scrollNum;
            } else {
              this.currentIndex += this.scrollNum;
            }
            this._renderer.removeClass(this.containerElm, 'grabbing');
            this.callRestart();
            this.hammer.stop(true);
            // remember prv action, to avoid hammer stop, then click
            this.prePanMove = true;
          }
        }
        break;
      case 'panend':
        this.callRestart();

        if (Math.abs(e.deltaX) > this.elmWidth * PANBOUNDARY) {
          const moveNum = this.isDragMany ?
            Math.ceil(Math.abs(e.deltaX) / this.elmWidth) : this.scrollNum;
          if (e.deltaX > 0) {
            this.currentIndex -= moveNum;
          } else {
            this.currentIndex += moveNum;
          }
          break;
        } else {
          if (!this.isDragMany && this.prePanMove) {
            this.callClick(e.center.x);
          }
        }
        this.drawView(this.currentIndex);
        this.prePanMove = false;
        break;
    }
  }

  setIndex(index: number) {
    if (this.autoplay) {
      this.stopEvent.next();
      this.restart.next('do restart');
    }
    this.currentIndex = index;
  }

  private outOfBound(type) {
    switch (type) {
      case 'panleft':
        return this.currentIndex === this.mostRightIndex;
      case 'panright':
        return this.currentIndex === 0;
    }
  }

  private runProgress(betweenTime): Observable<any> {
    const howTimes = this.speed / betweenTime;
    const everyIncrease = 100 / this.speed * betweenTime;
    // console.log('progress');
    return interval(betweenTime).pipe(
      tap(t => {
        this.progressWidth = (t % howTimes) * everyIncrease;
      }),
      bufferCount(Math.round(this.speed / betweenTime), 0)
    );
  }
  private getWindowWidthToNum() {
    const initNum = 3;
    // 610
    // if use window do check to avoid ssr problem.
    if (window) {
      const windowWidth = window.innerWidth;
      if (windowWidth > 300) {
        return Math.floor(initNum + (windowWidth / 200));
      }
    }
    return initNum;
  }
}
