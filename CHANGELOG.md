## 2.0.0-rc.1

### Update
* **angular**: update angular to angular 9.0

## 1.7.1

### Feature
* **pan-boundary**:add Input `[pan-boundary]` to user move picture with the container width rate, when more than that rate distance, it will go to next or prev.

## 1.7.0

### But Fix
* **Upgrade to angular 8.0+**:upgrade the angualr version with ng 8.
### Feature
* **swipe-velocity**:add Input `[swipe-velocity]` to custom swipe-speed

## 1.6.5-bata.1

### But Fix
* **fix when infinite element not exist problem**:fix when infinite element not init, clear cause carousel break problem.

## 1.6.4

### But Fix
* **fix infinite loop problem with rxjs**:fix infinite loop problem with rxjs.

## 1.6.3

### But Fix
* **show-number auto with breakpoint problem**: fix problem with breakpoint.

## 1.6.2

### But Fix
* **fix infinite loop problem with rxjs**:fix infinite loop problem with rxjs.

## 1.6.1

### Optimize Performance
* **Change animation way with `transform`**: using `transform: translateX()` to change left position.

### But Fix
* **Fix rounding error when calculating element width**: using `getBoundingClientRect()` to get init view width to avoid carousel display improperly, thanks for [anteq](https://github.com/anteq) in requests [17](https://github.com/ZouYouShun/ngx-hm-carousel/pull/17)

* **Prevent Drag click event trigger**: when hammer stop the click event will occur, fix that with document `touchend` and `mouseup`

* **Drag Boundary Problem**: caculate with left by touch boundary, caculate the swipe index.


# Break Change
* **Infinite mode or autoplay mode**: We need add `<ng-template #infiniteContainer></ng-template>` and `#carouselContent` in the template, and add `[data]="avatars"` in the `ngx-hm-carousel`, to make the template in the angular life cycle, the example is below.

```html
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

  <ng-template #carouselContent let-avatar let-i="index">
    <article class="item cursor-pointer"
      [ngClass]="{'visible': currentIndex===i}">
      <div class="img" (click)="click(i)"
        [style.backgroundImage]="'url('+avatar.url+')'">
        {{i}}
      </div>
    </article>
  </ng-template>
```

## 1.6.0

### Feature
* **Seprate moving animation with user occur and autoplay**: We seprate the animation class with `[aniClass]` and `[aniClassAuto]`, now we can use different class for that.   
[Example](https://stackblitz.com/edit/ngx-hm-carousel-seprate-transition-class)

## 1.5.2

### But Fix
* **Mouse over restart problem**: Fix error with `[mourse-enable]=true` problem with restart.

## 1.5.0

### Feature
* **Break point with width**: We can set own break point with input `[breakpoint]` to switch show number with own logic. [Example](https://stackblitz.com/edit/ngx-hm-carousel-custom-breakpoint)
**Important: the breakpoint is follow the `container width`, not follow with window width.**
```ts
// the breakpoint interface
export interface NgxHmCarouselBreakPointUp {
  width: number;
  number: number;
}

```

* **infinite with multi show number**: We can use the input `[show-num]` and set `[infinite]="true"`, it will clone the element to view, and can change the input dynamicly to switch show number. [Example](https://stackblitz.com/edit/ngx-hm-carousel-change-show-number-dynamicly)


### But Fix
* **Mouse over restart problem**: Fix when enable `mourse-enable`, when mourse on the carousel and drap the view, change index, the restart will run problem.

* **Drag many animation disappear problem**: Fil problem with drag many, the animation doesn't append problem.

## 1.4.1

### But Fix
* **Fix Animation error**: fix doesn't remove aniClass when remove animation.
* **Fix init with index error**: fix when init with index, the animation will occur problem.

## 1.4.0

### Feature
* **Add support with Angular Universal**: when universal run, it will init with carousel view.

## 1.3.2

### Feature
* **Add Disable Drag**: add input to switch drag event listener with [disable-drag].
* **When elements length zero can't drag**: Now when children elements length is equal zero, stop drag event.

### Break Change
* **Not drag with pan move**: change name with [notDrag] to [not-follow-pan].

## 1.3.1

### Optimize Performance
* **Optimize Performance**: fix problem with change Detection by onPush and ngZone

### Break Change
* **remove emit with progress width**: remove emit with progress width, it will cause performance problem, now it only using width change with progress bar, change like below.

```html
  <ng-template #carouselProgress let-progress>
    <div class="progress"></div>
  </ng-template>
```

```scss
  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;  // set default width to zero, it will increase with duraction (%)
    height: 5px;
    background: #ff5252;
  }
```

## 1.3.0

### Feature
* **Animation class**: add [input] with animation add class by [aniClass]
* **Not drag with pan move**: add [input] with Not drag with pan move by [notDrag]

## 1.2.9

### Bug fix
* **Mobile touch error**: Fix when scroll event occur, the carousel will move error point, and can't touch problem.

## 1.2.8

### Bug fix
* **carousel item change**: When add item to the children, will recaculate the carousel variable.

### Break Change
* **Add ngx-hm-carousel-item directive back**: with recaculate the carousel varibae so add `ngx-hm-carousel` back.

## 1.2.7

### Bug fix
* **Fix infinite problem with next and prev click**: fix error with infinite .
* **Fix mask not clear problem**: when drag occur, we use an mask to avoid click event emit, but it will not clear when drag end, add pancancel to fix that.

## 1.2.6

### Bug fix
* **When item is smaller than length the mask non remove**: fix bug when show number is more than item langth, mask click don't remove.

* **Mask bug fix**: Fix mask bug with grab.

### Break Change
* **Remove ngx-hm-carousel-item**: remove item directive in the container, just the first child of container is the item, and we can use nomal click event in the content.


## 1.2.3

### Feature
* **Speed Change Dynamically**: Now you can change input[autoplay-speed] to change speed dynamically.

## 1.2.2

### Bug Fix
* **align center**: when align set to 'center', always can drag move.
* **auto play**: infinite always changed with autoplay.

## 1.2.1

### Bug Fix
* **ng build --prod**: fix problem with ng build --prod.

## 1.2.0

### Feature
* **Dynamic Directive**: `ngxHmCarouselDynamic` can load item Dynmain.
* **infinite option**: Now, you can set infinite to true, make this carousel loop change.
* **ControlValueAccessor**: You can use ngModel with `ngx-hm-carousel`, more easy to use with index.

## BREAKING CHANGES
* **current-index**: `current-index` is removed, replace with `ngModel`.
* **index-change**: `index-change` is removed, replace with `ngModel`.


## 1.1.1

### Scroll to right
* **Scroll right change**: Scroll right upto length-showNum.

## 1.1.0

### Dynamic load element

* **Add Dynmain load element**: Add Dynmain load element with ngxHmCarouselDynamic directive.

### Example
```html
<ngx-hm-carousel
  [current-index]="currentI"
  [infinite]="true"
  [align]="left"
  class="carousel c-accent"
  (index-change)="currentI = $event">

  <!-- style="height: calc(100vh - 50px);" -->
  <section ngx-hm-carousel-container class="content">
    <article class="item cursor-pointer"
      *ngFor="let item of data; let i = index"
      ngx-hm-carousel-item>
      <div *ngxHmCarouselDynamic="i; length: data.length; index: currentI"
        class="img" [style.backgroundImage]="item.url">
      </div>
    </article>
  </section>

</ngx-hm-carousel>
```
## 1.0.9

### Bug fix

* **fix bug with showNum**: forget the get method of showNum, repair it.

## 1.0.8

### Bug fix

* **use resize-observer-polyfill to handle element resize**: use resize-observer-polyfill handle container resize

## 1.0.7

### Bug fix

* **set index response**: when set same current Index not response

## 1.0.6

### Bug fix

* **when show number is zero error**: when show number is zero, alignDistance always be zero

## 1.0.5

### Bug fix

* **click event position error** : fix when container has some padding or margin, the click event will give error index.

### Featrue
* **align mode** : add align mode with `[align]` `'left' | 'center' | 'right'`, default is center.

## 1.0.4

### Bug fix

* **when index change restart autoplay time**

## 1.0.3

### Bug fix

* **fix autoplay cancel bug**


## 1.0.2

### First Release

* **An carousel for Angular support mobiel with Hammerjs**

