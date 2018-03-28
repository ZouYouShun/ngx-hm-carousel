import { NgModule, ModuleWithProviders } from '@angular/core';


import { NgxfSelectDirective } from './directive/ngxf-select.directive';
import { NgxfDropDirective } from './directive/ngxf-drop.directive';
import { NgxfUploaderService } from './directive/ngxf-uploader.service';

@NgModule({
  declarations: [
    NgxfSelectDirective,
    NgxfDropDirective
  ],
  exports: [
    NgxfSelectDirective,
    NgxfDropDirective
  ]
})
export class NgxfUploaderModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxfUploaderModule,
      providers: [NgxfUploaderService]
    };
  }
}
