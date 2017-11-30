import { NgModule, } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatSlideToggleModule, MatSnackBarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { HmCarouselModule } from 'ngx-hm-carousel';

import { AppComponent } from './app.component';
import { DragManyComponent } from './drag-many/drag-many.component';
import { DragOneComponent } from './drag-one/drag-one.component';

@NgModule({
  declarations: [
    AppComponent,
    DragManyComponent,
    DragOneComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HmCarouselModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
