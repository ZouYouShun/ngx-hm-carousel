# NgxY2Player

Angular youtube player can auto resize with container, and full controll with [Youtube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) support SSR.

# Demo 

### Video ready and change event
https://zouyoushun.github.io/ngx-y2-player/
![](https://res.cloudinary.com/dw7ecdxlp/image/upload/v1515048453/ngx-y2-player_rgfqjo.gif)


### Auto resize with container, not outdistance of container with height
![](https://res.cloudinary.com/dw7ecdxlp/image/upload/v1522162592/y2-resize_halygm.gif)

![](https://res.cloudinary.com/dw7ecdxlp/image/upload/v1522212498/y2-resize2_ugo8sj.gif)


# install

```
npm install ngx-y2-player
```

# Usage

1. Module

```ts
import { NgxY2PlayerModule } from 'ngx-y2-player';

@NgModule({
  declarations: [ ...something... ],
  imports: [ ...something... , NgxY2PlayerModule.forRoot()], // forRoot only in the app.module
  providers: [ ...something... ],
  bootstrap: [ ...something... ]
})
export class AppModule {
  ...something...
}
```

3. HTML

```html
<div style="width:80%; height:500px;" #container>
  <ngx-y2-player
    #video
    [playerOptions]="playerOptions"
    [container]="container"
    (ready)="onReady($event)"
    (change)="onStateChange($event)"
    >
  </ngx-y2-player>
</div>

<div>
  <button (click)="pause()"> pause </button>
  <button (click)="play()"> play </button>
  <button (click)="stop()"> stop </button>

  <input type="text" #input value="3600">
  <button (click)="go(input.value)"> go </button>
</div>
```

2. TS

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxY2PlayerComponent, NgxY2PlayerOptions } from 'ngx-y2-player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('video') video: NgxY2PlayerComponent;

  playerOptions: NgxY2PlayerOptions = {
    videoId: 'z8WdQsPknf0',
    height: 500, // you can set 'auto', it will use container width to set size
    width: 500,
    playerVars: {
      autoplay: 1,
    },
    // aspectRatio: (3 / 4), // you can set ratio of aspect ratio to auto resize with
  };
  constructor() { }

  pause() {
    this.video.videoPlayer.pauseVideo();
  }
  play() {
    this.video.videoPlayer.playVideo();
  }
  stop() {
    this.video.videoPlayer.stopVideo();
  }
  go(second) {
    this.video.videoPlayer.seekTo(second, true);
  }

  onReady(event) {
    console.log('ready');
    console.log(event);
  }

  onStateChange(event) {
    console.log('change');
    console.log(event);
  }
}
```

## Attribute

| Attribute | necessary |  type | description |
| --------- | --------- | ---- | -------- |
| [playerOptions] | yes | Input(NgxY2PlayerOptions) | NgxY2PlayerOptions with [Youtube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)  |
| [container] | no | Input(Template Element) | when set width or height 'auto', it will use this element to set player size auto |
| (ready) | no | Output(function($event)) | when video ready emit value |
| (change) | no | Output(function($event)) | when video state change emit value |


### NgxY2PlayerOptions
```ts
export interface NgxY2PlayerOptions {
  videoId: string;
  width?: number | 'auto';
  height?: number | 'auto';
  playerVars?: YT.PlayerVars;
  aspectRatio?: number;
}
```
You can see vars in the https://developers.google.com/youtube/player_parameters#Parameters
