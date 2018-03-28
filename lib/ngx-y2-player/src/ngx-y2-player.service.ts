
import { Observable } from 'rxjs/Observable';
import { Injectable, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class Y2PlayerService {
  private isLoadApi = false;

  private loadComplete = new BehaviorSubject(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ready() {
    return this.loadComplete.pipe(
      filter(state => state === true)
    );
  }

  loadY2Api(elm: HTMLAnchorElement, render: Renderer2) {
    const id = this.createVideoId();
    render.setAttribute(elm, 'id', id);

    // if this api is not load, load this api
    if (!this.isLoadApi) {
      this.isLoadApi = true;
      const tag = render.createElement('script');
      render.setAttribute(tag, 'src', 'https://www.youtube.com/player_api');
      const firstScriptTag = render.selectRootElement('script'); // it will get the first one script
      render.insertBefore(firstScriptTag.parentNode, tag, firstScriptTag);

      if (isPlatformBrowser(this.platformId)) {
        const publicReady = () => {
          // console.log('api load!');
          this.loadComplete.next(true);
        };
        window['onYouTubeIframeAPIReady'] = publicReady;
      }
    }

    return id;
  }

  private createVideoId() {
    const len = 7;
    return Math.random().toString(35).substr(2, len);
  }

}
