
[![NPM version](https://badge.fury.io/js/ngx-hm-carousel.svg)](http://badge.fury.io/js/ngx-hm-carousel)
# ngx-hm-carousel

A lightweight carousel UI for Angular, support mobile touch with Hammerjs.

Work with custom animation, and server-side-rendering.

## Description

An Carousel that eazy to use with your custom template.

This package is design by angular and hammerjs, if you use @angular/material, I strongly recommend you use this package.

Depend on [Hammerjs](https://hammerjs.github.io/) and [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)

Support Angular 6+ and Rxjs6+

## Example
https://alanzouhome.firebaseapp.com/package/NgxHmCarousel

![](https://res.cloudinary.com/dw7ecdxlp/image/upload/v1533206320/1533206262496_soounq.gif)

![](https://i.imgur.com/SyyBSR9.gif)

## Stackblitz Example
[with custom animation](https://stackblitz.com/edit/ngx-hm-carousel-fade-example)

[custom-breakpoint](https://stackblitz.com/edit/ngx-hm-carousel-custom-breakpoint)

[change-show-number-dynamicly](https://stackblitz.com/edit/ngx-hm-carousel-change-show-number-dynamicly)

[disable-drag event](https://stackblitz.com/edit/ngx-hm-carousel-disable-drag)

[loop carousel](https://stackblitz.com/edit/ngx-hm-carousel-seprate-transition-class)


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
  [(ngModel)]="currentIndex"
  [show-num]="4"
  [autoplay-speed]="speed"
  [infinite]="infinite"
  [drag-many]="true"
  [aniTime]="200"
  [data]="avatars"
  class="carousel c-accent">

  <section ngx-hm-carousel-container class="content">
    <article class="item cursor-pointer"
      ngx-hm-carousel-item
      *ngFor="let avatar of avatars; let i = index"
        [ngClass]="{'visible': currentIndex===i}">
      <div class="img" (click)="click(i)"
        [style.backgroundImage]="'url('+avatar.url+')'">
        {{i}}
      </div>
    </article>
    <ng-template #infiniteContainer></ng-template>
  </section>

  <!-- only using in infinite mode or autoplay mode, that will render with-->
  <ng-template #carouselContent let-avatar let-i="index">
    <article class="item cursor-pointer"
      [ngClass]="{'visible': currentIndex===i}">
      <div class="img" (click)="click(i)"
        [style.backgroundImage]="'url('+avatar.url+')'">
        {{i}}
      </div>
    </article>
  </ng-template>

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
    <div class="progress"></div>
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

  currentIndex = 0;
  speed = 5000;
  infinite = true;
  direction = 'right';
  directionToggle = true;
  autoplay = true;
  avatars = '1234567891234'.split('').map((x, i) => {
    const num = i;
    // const num = Math.floor(Math.random() * 1000);
    return {
      url: `https://picsum.photos/600/400/?${num}`,
      title: `${num}`
    };
  });

  constructor() { }

  click(i) {
    alert(`${i}`);
  }

}
```

3. SCSS

* this project not contain any specile style, you can custom by yourself

```scss
$transition_time:.2s;

.carousel {
  color:white;
  .content {
    display: flex;

    .item {
      width: 100%;
      padding: .5em;
      display: block;
      opacity: 0.5;

      transition: opacity 0.295s linear $transition_time;

      &.visible {
        opacity: 1;
      }

      .img {
        width: 100%;
        height: 400px;
        display: block;
        background-size: cover;
        background-position: center;
      }
    }


  }

  .ball {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: black;
    border: 2px solid;
    opacity: 0.5;

    &.visible {
      opacity: 1;
    }
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
| `autoplay`               | no       | false                 | `boolean`         | ngx-hm-carousel | carousel auto play confing |
| `autoplay-speed`         | no       | 5000 (ms)             | `number`          | ngx-hm-carousel | auto play speed |
| `between-delay`          | no       | 8000 (ms)             | `number`          | ngx-hm-carousel | each auto play between time |
| `autoplay-direction`     | no       | 'right'               |`'left'` or `'right'`| ngx-hm-carousel | auto play direction       |
| `mourse-enable`          | no       | false                 | `boolean`         | ngx-hm-carousel | is mourse moveover stop the auto play |
| `autoplay`               | no       | false                 | `boolean`         | ngx-hm-carousel | carousel auto play confing |
| `[breakpoint]`           | no       | []                 | `NgxHmCarouselBreakPointUp`         | ngx-hm-carousel | switch show number with own logic like boostrap scss media-breakpoint-up |
| `show-num`               | no       | 1                     | `number`  or `'auto'` | ngx-hm-carousel | how many number items to show once |
| `scroll-num`             | no       | 1                     | `number`          | ngx-hm-carousel | how many number with each scroll |
| `drag-many`              | no       | false                 | `boolean`         | ngx-hm-carousel | is can scroll many item once,  simulate with scrollbar |
| `swipe-velocity`              | no       | 0.3                 | `number`         | ngx-hm-carousel | Minimal velocity required before recognizing, unit is in px per ms. |
| `pan-boundary`              | no       | 0.15                 | `number` of `false`        | ngx-hm-carousel| user move picture with the container width rate, when more than that rate, it will go to next or prev, set false will never move with distance rate |
| `align`               | no       | 'left'                 | `'left'` or `'right'` or `'center'` | ngx-hm-carousel | when show-num is bigger than 1, the first item align |
| `infinite`               | no       | false                 | `boolean`         | ngx-hm-carousel | is the carousel will move loop |
| `data`               | no       | undefined                 | `any[]`         | ngx-hm-carousel | the data you using with `*ngFor`, it need when infinite mode or autoplay mode |
| `aniTime`               | no       | 400                 | `number`         | ngx-hm-carousel | when `infinite` is true, the animation time with item |
| `aniClass`               | no       | 'transition'                 | `string`         | ngx-hm-carousel | this class will add when carousel touch drap or click change index |
| `aniClassAuto`               | no       |  'aniClass'      | `string`         | ngx-hm-carousel | this class will add when carousel auto play |
| `disable-drag`               | no       | false                 | `boolean`         | ngx-hm-carousel | disable drag event with touch and mouse pan moving|
| `not-follow-pan`               | no       | false                | `boolean`         | ngx-hm-carousel | disable when drag occur the child element will follow touch point. |
| `[(ngModel)]`               | no       | 0                 | `number`         | ngx-hm-carousel | You can bind ngModel with this carousel, it will two way binding with current index. You also can use `(ngModelChange)="change($event)"` with that. |


```ts
// the breakpoint interface
export interface NgxHmCarouselBreakPointUp {
  width: number;
  number: number;
}
```

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

