import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, Renderer2 } from '@angular/core';
import * as screenfull from 'screenfull';

export enum NgxHmGALLERY_TYPE {
  YOUTUBE = 'youtube',
  IMG = 'img',
  VIDEO = 'video'
}

export interface NgxHmGalleryItem {
  type: NgxHmGALLERY_TYPE;
  url: string;
  defaultUrl: string;
  isDownload?: boolean;
  [key: string]: any;
}

@Component({
  selector: 'ngx-hm-gallery',
  templateUrl: './ngx-hm-gallery.component.html',
  styleUrls: ['./ngx-hm-gallery.component.scss']
})
export class NgxHmGalleryComponent implements OnInit, OnDestroy {
  @ViewChild('imgDownload') imgDownload: ElementRef;
  @Input('data') data: NgxHmGalleryItem[];
  @Input('downlaod') isDownLoad = false;
  private _currentIndex = 0;
  @Input('index') set currentIndex(value) {
    this._currentIndex = value;
    if (this.isAfterInit && this.isDownLoad) {
      this.nowDState = this.isCanDownLoad(this.data[this._currentIndex]);
    }
  }
  get currentIndex() {
    return this._currentIndex;
  }
  nowDState = false;
  isAutoPlay = false;
  private isAfterInit = false;

  @Output('close') close = new EventEmitter<boolean>();

  constructor(private _render: Renderer2) { }

  ngOnInit(): void {
    this.isAfterInit = true;
    if (this.isDownLoad) {
      this.nowDState = this.isCanDownLoad(this.data[this.currentIndex]);
    }
  }

  switchIndex(index) {
    this.currentIndex = index;
  }

  closeView() {
    this.close.emit(true);
    screenfull.exit();
  }

  ngOnDestroy(): void {
  }

  download(file: NgxHmGalleryItem) {
    if (this.isCanDownLoad(file)) {
      this._render.setAttribute(this.imgDownload.nativeElement, 'href', `${file.url}`);
      this.imgDownload.nativeElement.click();
    }
  }

  toggleFullScreen() {
    screenfull.toggle();
  }

  private isCanDownLoad(file: NgxHmGalleryItem) {
    return file.type !== NgxHmGALLERY_TYPE.YOUTUBE && file.isDownload;
  }
}
