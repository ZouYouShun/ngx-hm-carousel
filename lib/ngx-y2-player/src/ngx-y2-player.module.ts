import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { NgxY2PlayerComponent } from './ngx-y2-player.component';
import { Y2PlayerService } from './ngx-y2-player.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxY2PlayerComponent
  ],
  exports: [
    NgxY2PlayerComponent
  ]
})
export class NgxY2PlayerModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: NgxY2PlayerModule,
      providers: [
        Y2PlayerService
      ]
    };
  }
}
