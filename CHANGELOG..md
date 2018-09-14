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
