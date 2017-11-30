import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule, MatSlideToggleModule, MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { HmCarouselModule } from 'ngx-hm-carousel';

import { AppComponent } from './app.component';
import { DragManyComponent } from './drag-many/drag-many.component';
import { DragOneComponent } from './drag-one/drag-one.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DragManyComponent,
    DragOneComponent
  ],
  imports: [
    BrowserModule,
    HmCarouselModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
