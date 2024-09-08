import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { input } from '@angular/core';

// TODO: ssr problem should not hide on ssr
// TODO: show number change should recalculate is show and init show number
@Directive({
  selector: '[ngxHmCarouselDynamic]',
  standalone: true,
})
export class NgxHmCarouselDynamicDirective {
  private _view = inject(ViewContainerRef);
  private _template = inject<TemplateRef<any>>(TemplateRef<any>);
  index = input<number | undefined>(undefined, {
    alias: 'ngxHmCarouselDynamic',
  });
  length = input(0, { alias: 'ngxHmCarouselDynamicLength' });
  show = input(1, { alias: 'ngxHmCarouselDynamicShow' });

  currentI = input(0, {
    alias: 'ngxHmCarouselDynamicIndex',
    transform: (value: number) => {
      if (!this.completed) {
        const nextI = value + this.show();
        const prevI = value - this.show();
        if (
          this.index() === 0 ||
          this.index() === this.length() - 1 ||
          this.index() === nextI ||
          this.index() === prevI ||
          this.index() === value
        ) {
          this._view.createEmbeddedView(this._template);
          this.completed = true;
        }
      }

      return value;
    },
  });

  private completed = false;

  constructor() {
    this._view.clear();
  }
}
