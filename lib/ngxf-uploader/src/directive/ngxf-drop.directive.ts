import { Directive, OnInit, EventEmitter, Output, Input, HostListener, ElementRef } from '@angular/core';

import { emitOpload } from './file-function';
import { FileOption, FileError } from './ngxf-uploader.service';

@Directive({
  selector: '[ngxf-drop]'
})
export class NgxfDropDirective implements OnInit {

  @Output('ngxf-drop') uploadOutput = new EventEmitter<File | File[] | FileError>();
  @Input('ngxf-validate') fileOption: FileOption;
  @Input('drop-class') dropClass = 'drop';
  @Input() multiple: string;
  @Input() accept: string;

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('drop', ['$event']) public drop(e: any) {
    this.stopEvent(e);
    this.el.classList.remove(this.dropClass);

    // if allow mutiple
    this.uploadOutput.emit(
      emitOpload(e.dataTransfer.files, this.accept, this.multiple, this.fileOption)
    );
  }

  @HostListener('dragover', ['$event'])
  @HostListener('dragenter', ['$event']) public dragenter(e: Event) {
    this.stopEvent(e);
    this.el.classList.add(this.dropClass);
  }

  @HostListener('dragleave', ['$event']) public dragleave(e: Event) {
    this.stopEvent(e);
    this.el.classList.remove(this.dropClass);
  }

  // prevent the file open event
  stopEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }

}
