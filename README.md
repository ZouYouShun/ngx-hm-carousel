[![NPM version](https://badge.fury.io/js/ngx-hm-carousel.svg)](http://badge.fury.io/js/ngx-hm-carousel)

# ngx-hm-carousel

A lightweight carousel UI for Angular, support mobile touch with Hammerjs.

Work with custom animation, and server-side-rendering.

## Description

An Carousel that easy to use with your custom template.

This package is design by angular and hammerjs.

Depend on [Hammerjs](https://hammerjs.github.io/).

Support `Angular 18+` please use `v18.x.x` version, which follow the main version of Angular.

for version before v18, please use `v3.0.0`, view more legacy version in [legacy readme](./README-LEGACY.md).

![](https://res.cloudinary.com/dw7ecdxlp/image/upload/v1533206320/1533206262496_soounq.gif)

![](https://i.imgur.com/SyyBSR9.gif)

## Stackblitz Example

[Stackblitz](https://stackblitz.com/edit/stackblitz-starters-nkd5pk?file=src%2Fmain.ts)

## Install

```ts
npm install --save ngx-hm-carousel hammerjs
```

## Example

```ts
import 'hammerjs';

import { provideExperimentalZonelessChangeDetection, model } from '@angular/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { NgxHmCarouselComponent, NgxHmCarouselDynamicDirective, NgxHmCarouselItemDirective } from './lib';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxHmCarouselComponent, NgxHmCarouselItemDirective, NgxHmCarouselDynamicDirective, NgClass, FormsModule, NgFor],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  currentIndex = model(0);
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
      title: `${num}`,
    };
  });

  click(i: number) {
    console.log(`${i}`);
  }
}

bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()],
});
```

app.component.html

```html
<ngx-hm-carousel [(ngModel)]="currentIndex" [show-num]="4" [autoplay-speed]="speed" [infinite]="infinite" [drag-many]="true" [aniTime]="200" [data]="avatars" class="select-none">
  <section ngx-hm-carousel-container class="flex">
    <article class="transition-opacity duration-200 ease-linear py-2 px-1" ngx-hm-carousel-item *ngFor="let avatar of avatars; let i = index" [ngClass]="currentIndex() === i ? 'opacity-100' : 'opacity-50'">
      <div class="h-96 bg-cover bg-center cursor-pointer" (click)="click(i)" [style.backgroundImage]="'url(' + avatar.url + ')'">{{ i }}</div>
    </article>
    <ng-template #infiniteContainer></ng-template>
  </section>

  <!-- only using in infinite mode or autoplay mode, that will render with-->
  <ng-template #carouselContent let-avatar let-i="index">
    <article class="transition-opacity duration-200 ease-linear py-2 px-1" [ngClass]="currentIndex() === i ? 'opacity-100' : 'opacity-50'">
      <div class="h-96 bg-cover bg-center cursor-pointer" (click)="click(i)" [style.backgroundImage]="'url(' + avatar.url + ')'">{{ i }}</div>
    </article>
  </ng-template>

  <ng-template #carouselPrev>
    <div class="w-[50px] text-center">
      <i class="material-icons text-3xl">keyboard_arrow_left</i>
    </div>
  </ng-template>
  <ng-template #carouselNext>
    <div class="w-[50px] text-center">
      <i class="material-icons text-3xl">keyboard_arrow_right</i>
    </div>
  </ng-template>

  <ng-template #carouselDot let-model>
    <div class="size-2.5 opacity-50 rounded-full border-2 border-solid bg-blue-600" [ngClass]="{ 'opacity-100': model.index === model.currentIndex }"></div>
  </ng-template>

  <ng-template #carouselProgress let-progress>
    <div class="progress"></div>
  </ng-template>
</ngx-hm-carousel>
```

## Input and Output

| Attribute            | Necessary | Default value | Type                                | Location        | Description                                                                                                                                         |
| -------------------- | --------- | ------------- | ----------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoplay`           | no        | false         | `boolean`                           | ngx-hm-carousel | carousel auto play confing                                                                                                                          |
| `autoplay-speed`     | no        | 5000 (ms)     | `number`                            | ngx-hm-carousel | auto play speed                                                                                                                                     |
| `between-delay`      | no        | 8000 (ms)     | `number`                            | ngx-hm-carousel | each auto play between time                                                                                                                         |
| `autoplay-direction` | no        | 'right'       | `'left'` or `'right'`               | ngx-hm-carousel | auto play direction                                                                                                                                 |
| `mouse-enable`       | no        | false         | `boolean`                           | ngx-hm-carousel | is mouse moveover stop the auto play                                                                                                                |
| `autoplay`           | no        | false         | `boolean`                           | ngx-hm-carousel | carousel auto play config                                                                                                                           |
| `[breakpoint]`       | no        | []            | `NgxHmCarouselBreakPointUp`         | ngx-hm-carousel | switch show number with own logic like bootstrap scss media-breakpoint-up                                                                           |
| `show-num`           | no        | 1             | `number` or `'auto'`                | ngx-hm-carousel | how many number items to show once                                                                                                                  |
| `scroll-num`         | no        | 1             | `number`                            | ngx-hm-carousel | how many number with each scroll                                                                                                                    |
| `drag-many`          | no        | false         | `boolean`                           | ngx-hm-carousel | is can scroll many item once, simulate with scrollbar                                                                                               |
| `swipe-velocity`     | no        | 0.3           | `number`                            | ngx-hm-carousel | Minimal velocity required before recognizing, unit is in px per ms.                                                                                 |
| `pan-boundary`       | no        | 0.15          | `number` of `false`                 | ngx-hm-carousel | user move picture with the container width rate, when more than that rate, it will go to next or prev, set false will never move with distance rate |
| `align`              | no        | 'left'        | `'left'` or `'right'` or `'center'` | ngx-hm-carousel | when show-num is bigger than 1, the first item align                                                                                                |
| `infinite`           | no        | false         | `boolean`                           | ngx-hm-carousel | is the carousel will move loop                                                                                                                      |
| `data`               | no        | undefined     | `any[]`                             | ngx-hm-carousel | the data you using with `*ngFor`, it need when infinite mode or autoplay mode                                                                       |
| `aniTime`            | no        | 400           | `number`                            | ngx-hm-carousel | when `infinite` is true, the animation time with item                                                                                               |
| `aniClass`           | no        | 'transition'  | `string`                            | ngx-hm-carousel | this class will add when carousel touch drag or click change index                                                                                  |
| `aniClassAuto`       | no        | 'aniClass'    | `string`                            | ngx-hm-carousel | this class will add when carousel auto play                                                                                                         |
| `disable-drag`       | no        | false         | `boolean`                           | ngx-hm-carousel | disable drag event with touch and mouse pan moving                                                                                                  |
| `not-follow-pan`     | no        | false         | `boolean`                           | ngx-hm-carousel | disable when drag occur the child element will follow touch point.                                                                                  |
| `[(ngModel)]`        | no        | 0             | `number`                            | ngx-hm-carousel | You can bind ngModel with this carousel, it will two way binding with current index. You also can use `(ngModelChange)="change($event)"` with that. |

```ts
// the breakpoint interface
export interface NgxHmCarouselBreakPointUp {
  width: number;
  number: number;
}
```

### Other Directive

normal click with effect the touch event, using this event replace that.

| Attribute              | Location | Description                            |
| ---------------------- | -------- | -------------------------------------- |
| `ngxHmCarouselDynamic` | any tag  | It will dynamic load tag with element. |

This Directive will Dynamic load element with previous element and next element and current element.

- Example

```html
<section ngx-hm-carousel-container class="content">
  <article class="item cursor-pointer" ngx-hm-carousel-item *ngFor="let item of data; let i = index">
    <div *ngxHmCarouselDynamic="i; length: data.length; index: currentI" class="img" [style.backgroundImage]="item.url"></div>
  </article>
</section>
```

1. first data is this data index
2. length is ths total length with array
3. index is now index
