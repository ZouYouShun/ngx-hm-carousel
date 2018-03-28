import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { NgxHmSortableDirective } from './ngx-hm-sortable.directive';
import { setStyle } from './ts/element/element.addStyle';

export interface NgxHmSortableData {
  id?: number;
  group: string;
  container: HTMLElement;
  elms?: HTMLElement[];
  data: Array<any>;
  directive: NgxHmSortableDirective;
}

export const sortableKey = 'ngx-hm-sortable-key';
export const appendedKey = 'ngx-hm-sortable-appended';
export const movingId = 'moving_clone_obj';

const maskHeight = 5;
const markWidth = 15;

@Injectable()
export class NgxHmSortableService {

  dnds: Array<NgxHmSortableData> = [];

  movingNode: HTMLElement;
  selectedNode: HTMLElement;
  prevSelector: HTMLElement;

  distinationData: NgxHmSortableData;

  appendedElm: { elm: any, top_bottomElm: any }[] = [];

  private _renderer: Renderer2;
  private nowMovingIndex: number;
  stopHmArray: HammerManager[] = [];

  currentElm$ = new BehaviorSubject<HTMLElement>(undefined);

  constructor() { }

  checkElm(elm: HTMLElement, hm: HammerManager) {

    const currentElm = this.currentElm$.getValue();
    // console.log(`check ${currentIndex}`);
    if (currentElm === undefined || currentElm.contains(elm)) {
      // 如果是第一次或是包含，就把當前的送出成自己
      this.currentElm$.next(elm);
    } else {
      this.pushStop(hm);
    }
    return this.currentElm$;
  }

  pushStop(hm: HammerManager) {
    // hm.stop(true);
    hm.set({ enable: false });
    // console.log(`${currentIndex} is stop!`);
    this.stopHmArray.push(hm);
  }

  save(dnd: NgxHmSortableData, renderer: Renderer2) {
    this._renderer = renderer;
    dnd.id = this.dnds.length;
    this.dnds.push(dnd);
    return dnd;
  }

  clear(selectedNodeClass) {
    this._renderer.setStyle(this.selectedNode, 'pointerEvents', 'auto');
    this.removeSelectStyle(this.selectedNode, selectedNodeClass);
    this.cleanMark();
    this.currentElm$.next(undefined);
    // remove moving node
    // if (this.movingNode) {
    //   this._renderer.removeChild(this.movingNode.parentNode, this.movingNode);
    // }

    // remove all append elements
    // this.appendedElm.forEach(elm => {
    //   // clear appended key
    //   this._renderer.removeAttribute(elm.elm, appendedKey);
    //   // clear top and bottom tag
    //   elm.top_bottomElm.forEach(tb => this._renderer.removeChild(tb.parentNode, tb));
    // });

    // restart hammer
    this.stopHmArray.forEach(hm => {
      hm.set({ enable: true });
      // hm.stop(true);
    });
    // reset variable
    this.movingNode = undefined;
    this.nowMovingIndex = undefined;
    this.distinationData = undefined;
    this.stopHmArray = [];
    this.appendedElm = [];
  }

  mask(elm: HTMLElement, key) {
    if (elm.attributes[appendedKey]) {
      return;
    }
    this._renderer.setStyle(elm, 'position', 'relative');
    this._renderer.setAttribute(elm, appendedKey, '');
    const top = this._renderer.createElement('div');
    setStyle(this._renderer, top, {
      // background: 'black',
      position: 'absolute',
      width: '100%',
      height: `${maskHeight}px`,
      left: 0,
      top: 0
    });
    this._renderer.setAttribute(top, 'id', 'top');
    this._renderer.setAttribute(top, sortableKey, `${key}`);

    const bottom = this._renderer.createElement('div');
    setStyle(this._renderer, bottom, {
      // background: 'black',
      position: 'absolute',
      width: '100%',
      height: `${maskHeight}px`,
      left: 0,
      bottom: 0
    });
    this._renderer.setAttribute(bottom, sortableKey, `${key}`);
    this._renderer.setAttribute(bottom, 'id', 'bottom');

    this._renderer.appendChild(elm, top);
    this._renderer.appendChild(elm, bottom);
    this.appendedElm = [...this.appendedElm, {
      elm: elm,
      top_bottomElm: [top, bottom]
    }];
  }

  // it will get top or bottom elm, and change this elm style
  mark(elm: HTMLElement, type: 1 | -1) {
    this.cleanMark();
    this._renderer.addClass(elm, 'ngx-hm-sortable-seletcor');
    this.prevSelector = elm;
  }

  private cleanMark() {
    if (this.prevSelector) {
      this._renderer.removeClass(this.prevSelector, 'ngx-hm-sortable-seletcor');
      this.prevSelector = null;
    }
  }

  createMovingTag(position, disY, movingNodeClass) {
    const clnElm = this.selectedNode.cloneNode(true) as HTMLElement;

    this._renderer.setAttribute(clnElm, 'id', movingId);

    setStyle(this._renderer, clnElm, {
      top: `${position.y - disY}px`,
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '3',
    });

    if (movingNodeClass) {
      this._renderer.addClass(clnElm, movingNodeClass);
    } else {
      setStyle(this._renderer, clnElm, {
        opacity: '0.5',
        backgroundColor: 'lightpink'
      });
    }

    return clnElm;
  }

  setSelectStyle(className: string) {
    if (!this.selectedNode) {
      return;
    }
    if (className) {
      this._renderer.addClass(this.selectedNode, className);
    } else {
      setStyle(this._renderer, this.selectedNode, {
        'border-color': '#00ffcc',
        'border-style': 'solid'
      });
    }
  }

  removeSelectStyle(node, className: string) {
    if (!this.selectedNode) {
      return;
    }
    this._renderer.setStyle(node, 'pointerEvents', 'auto');
    if (className) {
      this._renderer.removeClass(node, className);
    } else {
      setStyle(this._renderer, node, {
        'border-color': '',
        'border-style': ''
      });
    }
  }

}
