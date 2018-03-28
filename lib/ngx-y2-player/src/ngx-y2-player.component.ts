import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { take } from 'rxjs/operators';

import { Y2PlayerService } from './ngx-y2-player.service';

export interface NgxY2PlayerOptions {
  videoId: string;
  width?: number | 'auto';
  height?: number | 'auto';
  playerVars?: YT.PlayerVars;
  aspectRatio?: number;
}

@Component({
  selector: 'ngx-y2-player',
  templateUrl: './ngx-y2-player.component.html',
  styleUrls: ['./ngx-y2-player.component.scss']
})
export class NgxY2PlayerComponent implements AfterViewInit, OnDestroy {
  @Input('playerOptions') private playerOptions: NgxY2PlayerOptions;
  @Input('container') private containerElm: HTMLElement;
  private initHeight = 0;

  @Output('ready') ready = new EventEmitter();
  @Output('change') change = new EventEmitter();

  private tagId: string;
  private windowListener: () => void;
  videoPlayer: YT.Player;

  constructor(
    private _renderer: Renderer2,
    private _y2: Y2PlayerService,
    private player: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngAfterViewInit(): void {
    this.tagId = this._y2.loadY2Api(this.player.nativeElement, this._renderer);
    this.initHeight = this.containerElm.offsetHeight;

    this._y2.ready().pipe(
      take(1)
    ).subscribe(() => {

      const onReady = (event) => {
        this.ready.emit(event);
      };

      const onStateChange = (event) => {
        this.change.emit(event);
      };

      let width = 800;
      let height = 450;

      if (this.playerOptions.width !== 'auto' && this.playerOptions.height !== 'auto') {
        width = this.playerOptions.width;
        height = this.playerOptions.height;
      } else {
        ({ width, height } = this.getNowWidthAndHeight(width, height));

        if (isPlatformBrowser(this.platformId)) {
          this.windowListener = this._renderer.listen(window, 'resize', (event) => {
            ({ width, height } = this.getNowWidthAndHeight(width, height));
            this.videoPlayer.setSize(width, height);
          });
        }
      }

      this.videoPlayer = new YT.Player(this.tagId, {
        width,
        height,
        videoId: this.playerOptions.videoId,
        events: {
          onReady: onReady,
          onStateChange: onStateChange
        },
        playerVars: this.playerOptions.playerVars
      });

    });
  }

  ngOnDestroy(): void {
    if (this.windowListener) {
      this.windowListener();
    }
  }

  private getNowWidthAndHeight(width: number, height: number) {
    width = this.containerElm.offsetWidth;
    const aspectRation = this.playerOptions.aspectRatio || (9 / 16);
    height = width * aspectRation;

    // console.log(this.containerElm.offsetHeight);
    if (this.initHeight !== 0 && height > this.containerElm.offsetHeight) {
      height = this.containerElm.offsetHeight;
      width = height / aspectRation;
    }
    return { width, height };
  }
}
