# ngx-hm-carousel

A lightweight carousel UI for Angular, support mobile touch with Hammerjs.

Work with custom animation, Example:
https://stackblitz.com/edit/ngx-hm-carousel-fade-example

## Description

An Carousel that eazy to use with your custom template.

This package is design by angular and hammerjs, if you use @angular/material, I strongly recommend you use this package.

Depend on [Hammerjs](https://hammerjs.github.io/) and [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)

Support Angular 6+ and Rxjs6+

## Example
[https://alanzouhome.firebaseapp.com/package/NgxHmCarousel](https://alanzouhome.firebaseapp.com/package/NgxHmCarousel)

![](https://res.cloudinary.com/dw7ecdxlp/image/upload/v1533206320/1533206262496_soounq.gif)

![](https://i.imgur.com/SyyBSR9.gif)


## Install

```ts
npm install --save ngx-hm-carousel
```

1. HammerJs

+ Import `hammerjs` in your main.ts or app.module.ts;

```ts
import 'hammerjs';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
...
...
```

+ Import `NgxHmCarouselModule` into your main AppModule or the module where you want use.

1. Module

```ts
import { NgxHmCarouselModule } from 'ngx-hm-carousel';

@NgModule({
  imports: [
    NgxHmCarouselModule
  ]
})
export class YourModule {}
```

2. HTML


```html
<ngx-hm-carousel
  [(ngModel)]="index"
  (ngModelChange)="indexChanged($event)"
  [autoplay-speed]="3000"
  [autoplay]="true"
  [infinite]="infinite"
  [between-delay]="2000"
  class="carousel c-accent">

  <section ngx-hm-carousel-container class="content">
    <article class="item cursor-pointer"
      ngx-hm-carousel-item
      *ngFor="let avatar of avatars">
      <div class="img"
        [style.backgroundImage]="'url('+avatar.url+')'">
      </div>
    </article>
  </section>

  <ng-template #carouselPrev>
    <div class="click-area">
      <i class="material-icons">keyboard_arrow_left</i>
    </div>
  </ng-template>
  <ng-template #carouselNext>
    <div class="click-area">
      <i class="material-icons">keyboard_arrow_right</i>
    </div>
  </ng-template>

  <ng-template #carouselDot let-model>
    <div class="ball bg-accent"
      [class.visible]="model.index === model.currentIndex"></div>
  </ng-template>

  <ng-template #carouselProgress let-progress>
    <div class="progress" *ngIf="progress > 0"
    [style.width]="(direction==='right' ? progress : 100 - progress) + '%'"></div>
  </ng-template>

</ngx-hm-carousel>
```

2. TS

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-drag-one',
  templateUrl: './drag-one.component.html',
  styleUrls: ['./drag-one.component.scss']
})
export class DragOneComponent {

  index = 0;
  infinite = true;
  direction = 'right';
  directionToggle = true;
  autoplay = true;
  avatars = '1234567890'.split('').map((x, i) => {
    const num = i;
    // const num = Math.floor(Math.random() * 1000);
    return {
      url: `https://picsum.photos/600/400/?${num}`,
      title: `${num}`
    };
  });

  constructor() { }

  indexChanged(index) {
    console.log(index);
  }

}
```

3. SCSS

* this project not contain any specile style, you can custom by yourself

```css
.carousel {
  .content {
    display: flex;
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
    height: 5px;
    background: #ff5252;
  }
  .click-area {
    width: 50px;
    text-align: center;
    i {
      font-size: 3em;
    }
  }
}
```
[View more examples](https://alanzouhome.firebaseapp.com/package/NgxHmCarousel)

## Attribute

### Configuration (Input)
-------------

| Attribute                 | Necessary | Default value         | Type            | Location           | Description        |
| ------------------------ | -------- | --------------------- | --------------- | ------------------ | ------------------ |
| `autoplay`               | no       | false                 | boolean         | ngx-hm-carousel | carousel auto play confing |
| `autoplay-speed`         | no       | 5000 (ms)             | number          | ngx-hm-carousel | auto play speed |
| `between-delay`          | no       | 8000 (ms)             | number          | ngx-hm-carousel | each auto play between time |
| `autoplay-direction`     | no       | 'right'               |'left' or 'right'| ngx-hm-carousel | auto play direction       |
| `mourse-enable`          | no       | false                 | boolean         | ngx-hm-carousel | is mourse moveover stop the auto play |
| `show-num`               | no       | 1                     | number  or 'auto' | ngx-hm-carousel | how many number items to show once |
| `scroll-num`             | no       | 1                     | number          | ngx-hm-carousel | how many number with each scroll |
| `drag-many`              | no       | false                 | boolean         | ngx-hm-carousel | is can once scroll many item, 
simulate with scrollbar |
| `align`               | no       | 'left'                 | 'left'|'right'|'center' | ngx-hm-carousel | when show-num is bigger than 1, the first item align |
| `infinite`               | no       | false                 | boolean         | ngx-hm-carousel | is the carousel will move loop |
| `aniTime`               | no       | 400                 | number         | ngx-hm-carousel | when `infinite` is true, the animation time with item |
| `[(ngModel)]`               | no       | 0                 | number         | ngx-hm-carousel | You can bind ngModel with this carousel, it will two way binding with current index. You also can use `(ngModelChange)="change($event)"` with that. |

### Other Directive


nomal click with effect the touch event, using this event replace that.

| Attribute                                          | Location | Description |
| ----------------------------------------------- | ----------- | ----------- |
| `ngxHmCarouselDynamic`                           | any tag | It will dynamic load tag with element. |

This Directive will Dynamin load element with previous element and next element and current element.

* Example
```html
<section ngx-hm-carousel-container class="content">
  <article class="item cursor-pointer"
    ngx-hm-carousel-item
    *ngFor="let item of data; let i = index">
    <div *ngxHmCarouselDynamic="i; length: data.length; index: currentI"
      class="img" [style.backgroundImage]="item.url">
    </div>
  </article>
</section>
```
1. first data is this data index
2. length is ths total length with array
3. index is now index

