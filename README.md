# NgxHmCarousel [DEMO](https://zouyoushun.github.io/ngx-hm-carousel)

A lightweight carousel UI for Angular, support mobile pan by Hammerjs.

[ZouYouShun/ngx-hm-carousel](https://github.com/ZouYouShun/ngx-hm-carousel)

This package is design by angular and hammerjs, if you use @angular/material, I strongly recommend you use this package.

Depend on [Hammerjs](https://hammerjs.github.io/) and [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)

Upgrade to Angular 6+ and Rxjs6+


<img src="https://i.imgur.com/SyyBSR9.gif" width="686">


## Installation
------------

install package

```bash
npm install --save ngx-hm-carousel
```

## Usage
-----

import module:

```ts
import { HmCarouselModule } from 'ngx-hm-carousel';

@NgModule({
  imports: [
    HmCarouselModule
  ]
})
export class YourModule {}
```

## Examples
--------

### app.component.html

```html
<ngx-hm-carousel
  [autoplay-speed]="5000"
  [autoplay]="true"
  [infinite]="true"
  [align]="left"
  [between-delay]="2000"
  class="carousel c-accent">

  <section ngx-hm-carousel-container class="content">
    <article class="item cursor-pointer"
      *ngFor="let item of data"
      ngx-hm-carousel-item>
      <div class="img"
        [style.backgroundImage]="'url('+item.url+')'">
      </div>
    </article>
  </section>

  <ng-template #carouselDot let-model>
    <div class="ball bg-accent"
      [class.visible]="model.index === model.currentIndex"></div>
  </ng-template>

  <ng-template #carouselProgress let-model>
      <div class="progress" [style.width]="model.progress + '%'"></div>
  </ng-template>

</ngx-hm-carousel>
```

### app.component.ts

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  data = [
    {
      'name': 'kristy',
      'type': 'img',
      'url': 'http://unsplash.it/600/400?image=940',
      'defaultUrl': 'https://de.aorus.com/upload/Downloads/F_20170531143736CxudUM.JPG',
      'isDownload': true
    },
    {
      'name': 'kristy',
      'type': 'img',
      'url': 'http://unsplash.it/600/400?image=885',
      'defaultUrl': 'https://de.aorus.com/upload/Downloads/F_20170531143736CxudUM.JPG',
      'isDownload': true
    },
    {
      'name': 'kristy',
      'type': 'img',
      'url': 'http://unsplash.it/600/400?image=815',
      'defaultUrl': 'https://de.aorus.com/upload/Downloads/F_20170531143736CxudUM.JPG',
      'isDownload': true
    },
    {
      'name': 'kristy',
      'type': 'img',
      'url': 'http://unsplash.it/600/400?image=401',
      'defaultUrl': 'https://de.aorus.com/upload/Downloads/F_20170531143736CxudUM.JPG',
      'isDownload': true
    },
    {
      'name': 'kristy',
      'type': 'img',
      'url': 'http://unsplash.it/600/400?image=623',
      'defaultUrl': 'https://de.aorus.com/upload/Downloads/F_20170531143736CxudUM.JPG',
      'isDownload': true
    },
    {
      'name': 'kristy',
      'type': 'img',
      'url': 'http://unsplash.it/600/400?image=339',
      'defaultUrl': 'https://de.aorus.com/upload/Downloads/F_20170531143736CxudUM.JPG',
      'isDownload': true
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  click($event) {
    this.cIndex = $event;
  }

  change($event) {
    console.log($event);
  }
}
```

### app.component.scss

add your custom css, below is Example.

```scss
.carousel {
  .content {
    display: flex;
  }
  .item {
    width: 100%;
    display: block;
    .img {
      width: 100%;
      display: block;
      background-size: cover;
      background-position: center;
      height: 0;
      padding-bottom: 50%;
    }
  }
  .ball {
    width: 10px;
    height: 10px;
    border-radius: app-border-radius(cycle);
    background: black;
    border: 2px solid;
    opacity: 0.5;
    &.visible {
      opacity: 1;
    }
  }
  &.transition {
    transition: all .4s ease-in-out;
  }
  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: pink;
  }
}

```

[View more examples](zouyoushun.github.io/ngx-hm-carousel)


## Configuration (Input)
-------------

| Argument                 | Required | Default value         | Type            | Location           | Description        |
| ------------------------ | -------- | --------------------- | --------------- | ------------------ | ------------------ |
| `autoplay`               | no       | false                 | boolean         | carousel-container | carousel auto play confing |
| `autoplay-speed`         | no       | 5000 (ms)             | number          | carousel-container | auto play speed |
| `between-delay`          | no       | 8000 (ms)             | number          | carousel-container | each auto play between time |
| `autoplay-direction`     | no       | 'right'               |'left' or 'right'| carousel-container | auto play direction       |
| `mourse-enable`          | no       | false                 | boolean         | carousel-container | is mourse moveover stop the auto play |
| `show-num`               | no       | 1                     | number  or 'auto' | carousel-container | how many number items to show once |
| `scroll-num`             | no       | 1                     | number          | carousel-container | how many number with each scroll |
| `drag-many`              | no       | false                 | boolean         | carousel-container | is can once scroll many item, 
simulate with scrollbar |
| `current-index`          | no       | 0 (The index of first one in the array.) | number         | carousel-container | set the carousel current index |

## Methods (Output)
-------

| Method                                          | Location | Description |
| ----------------------------------------------- | ----------- | ----------- |
| `index-change`                                  | carousel-container | when index change, it will emit now index |
| `carousel-item-click`                           | carousel-items-container > carousel-item | item click event, don't use nomal click on the item |
