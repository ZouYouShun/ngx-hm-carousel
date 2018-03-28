import { Directive, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[ngx-hm-carousel-item]'
})
export class NgxHmCarouselItemDirective {
  @Output('ngx-hm-carousel-item') clickEvent = new EventEmitter<number>();

  constructor() { }

}
