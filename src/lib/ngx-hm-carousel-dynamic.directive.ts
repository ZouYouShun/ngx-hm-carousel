import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngxHmCarouselDynamic]'
})
export class NgxHmCarouselDynamicDirective implements OnInit {

  @Input('ngxHmCarouselDynamic') index: number;
  @Input('ngxHmCarouselDynamicLength') length: number;
  @Input('ngxHmCarouselDynamicIndex')

  set currentI(value: number) {
    if (!this.compelete) {

      const nextI = value + 1;
      const prevI = value - 1;

      if (
        this.index === 0 ||
        this.index === this.length - 1 ||
        this.index === nextI ||
        this.index === prevI ||
        this.index === value) {
        this._view.createEmbeddedView(this._template);
        this.compelete = true;
      }
    }
  }

  private compelete = false;
  constructor(
    private _view: ViewContainerRef,
    private _template: TemplateRef<any>) {
    this._view.clear();
  }

  ngOnInit(): void {
  }

}
