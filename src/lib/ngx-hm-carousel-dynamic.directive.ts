import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

// TODO: ssr problem should not hide on ssr
// TODO: show number change should recalculate is show and init show number
@Directive({
  selector: '[ngxHmCarouselDynamic]',
})
export class NgxHmCarouselDynamicDirective implements OnInit {
  @Input('ngxHmCarouselDynamic') index: number;
  @Input('ngxHmCarouselDynamicLength') length: number;
  @Input('ngxHmCarouselDynamicShow') show = 1;
  @Input('ngxHmCarouselDynamicIndex')
  set currentI(value: number) {
    if (!this.completed) {
      const nextI = value + this.show;
      const prevI = value - this.show;
      if (
        this.index === 0 ||
        this.index === this.length - 1 ||
        this.index === nextI ||
        this.index === prevI ||
        this.index === value
      ) {
        this._view.createEmbeddedView(this._template);
        this.completed = true;
      }
    }
  }

  private completed = false;

  constructor(
    private _view: ViewContainerRef,
    private _template: TemplateRef<any>,
  ) {
    this._view.clear();
  }

  ngOnInit(): void {}
}
