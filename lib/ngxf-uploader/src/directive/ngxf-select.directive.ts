import { Directive, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, HostBinding } from '@angular/core';

import { emitOpload } from './file-function';
import { FileOption, FileError } from './ngxf-uploader.service';


@Directive({
  selector: '[ngxf-select]'
})
export class NgxfSelectDirective implements OnInit {
  @HostBinding('style.display') display = 'none';

  @Output('ngxf-select') uploadOutput = new EventEmitter<File | File[] | FileError>();
  @Input('ngxf-validate') fileOption: FileOption;
  @Input() multiple: string;
  @Input() accept: string;


  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('change', ['$event']) public fileChange() {
    // if allow mutiple
    if (this.el.files.length > 0) {
      // if allow mutiple
      this.uploadOutput.emit(
        emitOpload(this.el.files, this.accept, this.multiple, this.fileOption)
      );
      this.el.value = '';
    }
  }

}
