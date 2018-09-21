import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxHmCarouselDynamicDirective } from './ngx-hm-carousel-dynamic.directive';
import { NgxHmCarouselComponent } from './ngx-hm-carousel.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    NgxHmCarouselComponent,
    NgxHmCarouselDynamicDirective
  ],
  exports: [
    NgxHmCarouselComponent,
    NgxHmCarouselDynamicDirective
  ]
})
export class NgxHmCarouselModule { }
