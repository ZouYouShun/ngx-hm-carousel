import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxHmCarouselComponent } from './ngx-hm-carousel.component';
import { NgxHmCarouselItemDirective } from './ngx-hm-carousel-item.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    NgxHmCarouselComponent,
    NgxHmCarouselItemDirective,
  ],
  exports: [
    NgxHmCarouselComponent,
    NgxHmCarouselItemDirective,
  ]
})
export class NgxHmCarouselModule { }
