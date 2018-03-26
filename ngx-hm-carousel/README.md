# NgxHmCarousel [DEMO](https://zouyoushun.github.io/ngx-hm-carousel)

A lightweight carousel UI for Angular.

[ZouYouShun/ngx-hm-carousel](https://github.com/ZouYouShun/ngx-hm-carousel)

This package is design by angular and hammerjs, if you use @angular/material, I strongly recommend you use this package.


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
<carousel-container
  [autoplay]="true"
  [autoplay-speed]="3000"
  [between-delay]="2000"
  (index-change)="switchIndex($event)">

  <section
    carousel-items-container
    class="pane-container">
    <article class="pane cursor-pointer"
      *ngFor="let avatar of avatars; let i = index;"
      carousel-item
      (carousel-item-click)="openGallery($event)"
      [style.backgroundImage]="avatar.defaultUrl | safe:'background-image'">
      <div class="inner">
        <header>
          <p>gogogo</p>
          <h2>{{i}}</h2>
          <p>gogogo</p>
        </header>
      </div>
    </article>
  </section>

  <ng-template  #carouselPrev>
    <i class="material-icons icon" style="font-size:50px;">keyboard_arrow_left</i>
  </ng-template>

  <ng-template #carouselNext>
    <i class="material-icons icon" style="font-size:50px;">keyboard_arrow_right</i>
  </ng-template>

  <ng-template #carouselDot let-model>
      <div class="ball"
        [class.visible]="model.index === model.currentIndex"></div>
  </ng-template>

  <ng-template #carouselProgress let-model>
      <div class="progress" [style.width]="model.progress + '%'"></div>
  </ng-template>

</carousel-container>
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
 
  avatars = [
    {
      name: 'coffee',
      url: 'https://www.w3schools.com/w3images/coffee.jpg',
    },
    {
      name: 'mist',
      url: 'https://www.w3schools.com/w3images/mist.jpg',
    },
    {
      name: 'workbench',
      url: 'https://www.w3schools.com/w3images/workbench.jpg',
    },
    {
      name: 'bridge',
      url: 'https://www.w3schools.com/w3images/bridge.jpg',
    },
    {
      name: 'woods',
      url: 'https://www.w3schools.com/w3images/woods.jpg',
    },
  ];
  
  openGallery($event) {
    console.log($event);
  }

  switchIndex($event) {
    console.log($event);
  }
}
```

### app.component.scss

add your custom css, below is Example.

```scss
.progress {
  width: 0%;
  height: 5px;
  background: rgb(216, 253, 92);
  position: absolute;
  bottom: 0;
}

.icon {
  color: white;
  padding-left: 1rem;
  padding-right: 1rem;
  cursor: pointer;
}

ul li {
  padding: 0 0 0 4em;
}

ul li span {
  font-size: 2em;
}

.pane-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  line-height: 0;
}

.pane-container.transition {
  transition: left .4s ease-in-out;
}

.pane {
  display: inline-flex;
  justify-content: center;
  width: 100%;
  height: 500px;
  background-attachment: scroll;
  background-size: cover;
  background-position: center;
}

.inner {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 80rem;
  color: white;
  h2 {
    font-size: 7rem
  }
}

.ball {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: rgba(255, 255, 255, 0.35);
  &.visible {
    background: white;
  }
}
```

[View more examples](zouyoushun.github.io/ngx-hm-carousel)

## index.html
because I use material icon, so add material icon CDN
```html
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

## Configuration (Input)
-------------

| Argument                 | Required | Default value         | Type            | Location           | Description        |
| ------------------------ | -------- | --------------------- | --------------- | ------------------ | ------------------ |
| `autoplay`               | no       | false                 | boolean         | carousel-container | 自動播放            |
| `autoplay-speed`         | no       | 5000 (ms)             | number          | carousel-container | 自動播放的速度       |
| `between-delay`          | no       | 8000 (ms)             | number          | carousel-container | 自動播放被暫停的時間 |
| `autoplay-direction`     | no       | RUN_DIRECTION.RIGHT   | RUN_DIRECTION   | carousel-container | 往右邊自動播放       |
| `mourse-enable`          | no       | false                 | boolean         | carousel-container | 是否啟用滑鼠滑入停用自動播放功能|
| `show-num`               | no       | 1                     | number          | carousel-container | 顯示筆數            |
| `scroll-num`             | no       | 1                     | number          | carousel-container | 一次移動的筆數       |
| `drag-many`              | no       | false                 | boolean         | carousel-container | 模擬scroll的動作    |
| `current-index`          | no       | 0 (The index of first one in the array.) | number         | carousel-container | 回傳目前所在的陣列中的第幾個索引 |

## Methods (Output)
-------

| Method                                          | Location | Description |
| ----------------------------------------------- | ----------- | ----------- |
| `index-change`                                  | carousel-container | 取得目前顯示的index |
| `carousel-item-click`                           | carousel-items-container > carousel-item | 可以針對目前索引的資訊綁定事件 |


Collaborators
-------------

| [![](https://avatars0.githubusercontent.com/u/5878538?s=80&v=4)](https://github.com/ZouYouShun) | [![](https://avatars2.githubusercontent.com/u/12579766?s=80&v=4)](https://github.com/SHANG-TING) | [![](https://avatars2.githubusercontent.com/u/29812800?s=80&v=4)](https://github.com/kevinwang6303) | [![](https://avatars1.githubusercontent.com/u/6997163?s=80&v=4)](https://github.com/XuPeiYao) |
|-|-|-|-|
| [@ZouYouShun](https://github.com/ZouYouShun) | [@SHANG-TING](https://github.com/SHANG-TING) | [@kevinwang6303](https://github.com/kevinwang6303) | [@XuPeiYao](https://github.com/XuPeiYao) |

