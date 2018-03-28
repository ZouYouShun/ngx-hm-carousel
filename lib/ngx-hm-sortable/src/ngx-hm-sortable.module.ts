import 'hammerjs';

import { ModuleWithProviders, NgModule } from '@angular/core';

import { NgxHmSortableDirective } from './ngx-hm-sortable.directive';
import { NgxHmSortableService } from './ngx-hm-sortable.service';

@NgModule({
  declarations: [
    NgxHmSortableDirective
  ],
  exports: [NgxHmSortableDirective],
  providers: [NgxHmSortableService]
})
export class NgxHmSortableModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxHmSortableService,
      providers: [NgxHmSortableService]
    };
  }
}
