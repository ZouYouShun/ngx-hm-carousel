import { AfterViewInit, Directive, ElementRef, Inject, Input, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { take, tap, takeWhile, switchMapTo } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { interval } from 'rxjs/observable/interval';

import { NgxHmSortableData, NgxHmSortableService, sortableKey } from './ngx-hm-sortable.service';
import { elementsFromPoint, insertAfter } from './ts/element';
import { setStyle } from './ts/element/element.addStyle';

const enum MOVE_TYPE {
  UP,
  DOWN
}

const indexId = 'ngx-hm-sortable-index';
const rootId = 'ngx-hm-root';

@Directive({
  selector: '[ngx-hm-sortable]'
})
export class NgxHmSortableDirective implements AfterViewInit {
  @Input('ngx-hm-sortable') NgxHmSortable: string;
  @Input() sourceData: any[];
  @Input() selectedNodeClass: string;
  @Input() movingNodeClass: string;
  @Input() elmsSelector: string;
  @Input() moveSelector: string;

  private selectedIndex: number;
  private currentIndex: number;

  private prevAction: MOVE_TYPE;
  private priContainer;
  // use to check hammer state
  private isStop = false;
  private stopSubscription: Subscription;

  private data: NgxHmSortableData;
  // save stop hammer elm
  private stopElm = [];

  public constructor(
    private el: ElementRef,
    private _dnd: NgxHmSortableService,
    private _renderer: Renderer2,
    @Inject(DOCUMENT) private document) {

  }

  ngAfterViewInit(): void {

    this.data = this._dnd.save({
      group: this.NgxHmSortable,
      container: this.el.nativeElement,
      data: this.sourceData,
      directive: this,
    }, this._renderer);

    this._renderer.setAttribute(this.data.container, 'id', `dnd${this.data.id}`);

    this.data.elms = this.setSelectorElm(this.el.nativeElement);

    Array.from(this.data.elms).forEach((el: HTMLElement) => {
      this.bindingHammer(el);
    });
  }

  public bindingHammer(el: HTMLElement) {
    // console.log('bind hm');
    const hm = new Hammer(this.getMoveSelector(el));

    // let the pan gesture support all directions.
    hm.get('pan').set({ direction: Hammer.DIRECTION_ALL, pointers: 1 });

    hm.on('panstart panmove panend', (e: HammerInput) => {
      console.log(this.data.id, e.type);
      switch (e.type) {
        case 'panstart': {
          e.preventDefault();

          // // 剛開始設定為自己
          this._dnd.distinationData = this.data;

          const currentElm = this.findItemNode(e.target);

          const indexAttr = currentElm.attributes[indexId];
          if (indexAttr === undefined) {
            console.log('rr');
            return;
          }

          // console.log(`now id: ${this.data.id}`);

          this.stopSubscription =
            this._dnd.checkElm(currentElm, hm).pipe(
              takeWhile(d => {
                if (d !== currentElm) {
                  this.stopSubscription.unsubscribe();
                  this._dnd.removeSelectStyle(currentElm, this.selectedNodeClass);
                  this.isStop = true;
                  this._dnd.pushStop(hm);
                  return false;
                }
                return true;
              }),
              tap(() => {
                this.selectedIndex = this.currentIndex = +indexAttr.value;
                // set choiceNode to this start tag
                this._dnd.selectedNode = this.data.elms[this.selectedIndex];
                // set this elem style
                this._renderer.setStyle(this._dnd.selectedNode, 'pointerEvents', 'none');

                this.disPointer(this._dnd.selectedNode);

                // clone a new tag call sort_clone_obj and hidden it
                // this.createMovingElm(e);
                this._dnd.setSelectStyle(this.selectedNodeClass);
              }),
              // switchMapTo(interval(300).pipe(
              //   tap((d) => {
              //     // console.log(`${this.data.id} ${1}`);
              //   }))
              // )
            ).subscribe(
              d => { },
              () => { },
              () => {
                // console.log(this.data.id + ' complete');
              }
            );

        } break;
        case 'panmove': {
          e.preventDefault();
          if (this.isStop || !this.stopSubscription) {
            console.log('stop');
            return;
          }
          // if (this._dnd.movingNode) {
          //   this._renderer.setStyle(this._dnd.movingNode, 'transform', `translate(${e.deltaX}px, ${e.deltaY}px`);
          // }
          let key;
          // 找出範圍內的li
          elementsFromPoint(this.document, e.center.x, e.center.y, (elm: HTMLElement) => {
            key = elm.attributes[sortableKey];
            if (key !== undefined) {
              key = +key.value;

              this._dnd.distinationData = this._dnd.dnds[key];
              // if this container is in this container, it is child node of itself
              if (this._dnd.selectedNode.contains(this._dnd.distinationData.container)) {
                return false;
              }
              return true;
            }
            return false;
          }).then((currentElm: HTMLElement) => {
            // it means switch countainer
            const itemElm = this.findItemNode(currentElm);

            const indexAttr = itemElm.attributes[indexId];
            if (indexAttr === undefined) {
              console.log(undefined);
              return;
            }

            // this._dnd.mask(itemElm, key);

            const toIndex = +indexAttr.value;

            // if (this._dnd.distinationData !== this.data) {
            // console.log('switch area', currentElm.id);
            if (currentElm.id === 'top' || currentElm.id === 'bottom') {
              // console.log(`find ${currentElm.id}`);
              this._dnd.mark(currentElm, currentElm.id === 'top' ? -1 : 1);
            }
            // this.restartPointer();
            // this.disPointer(currentElm);
            this.prevAction = undefined;
            // } else {
            //   this._dnd.clearMask();
            //   this.moveIndex(this.currentIndex, toIndex, itemElm);
            // }

            this.currentIndex = toIndex;
          });
        } break;
        case 'panend': {
          this.stopSubscription.unsubscribe();
          this.restartPointer();
          this.stopElm.length = 0;
          if (!this.isStop && this._dnd.prevSelector) {
            // console.log(this._dnd.prevSelector);
            const itemElm = this.findItemNode(this._dnd.prevSelector);
            const indexAttr = itemElm.attributes[indexId];

            const containerKey = itemElm.attributes[sortableKey];
            let toIndex = +indexAttr.value + (this._dnd.prevSelector.id === 'bottom' ? 1 : 0);
            const distinationData = this._dnd.dnds[containerKey.value];
            const tmp = this.sourceData[this.selectedIndex];

            if (indexAttr === undefined) {
              console.log('unsave node');
            } else {
              if (this._dnd.distinationData === this.data) {
                if (toIndex > this.selectedIndex) { toIndex--; }
              }
              this.sourceData.splice(this.selectedIndex, 1);
              distinationData.data.splice(toIndex, 0, tmp);

              if (this._dnd.distinationData === this.data) {
                this.reGetContainerElms();
              } else {
                distinationData.directive.reGetContainerElms(toIndex);
              }

            }

          }
          this._dnd.clear(this.selectedNodeClass);
          // console.log('end');
          this.selectedIndex = undefined;
          this.currentIndex = undefined;
          this.prevAction = undefined;
          this.isStop = false;
        } break;
      }
    });
    return hm;
  }


  private createMovingElm(e: HammerInput) {
    this._dnd.movingNode = this._dnd.createMovingTag(
      e.center,
      Math.abs(this._dnd.selectedNode.getBoundingClientRect().top - e.center.y), this.movingNodeClass
    );
    this._renderer.appendChild(this.data.container, this._dnd.movingNode);
    this._renderer.setStyle(this._dnd.movingNode, 'width', `${this._dnd.selectedNode.offsetWidth}px`);
  }



  private restartPointer() {
    this.stopElm.forEach(elm => {
      this._renderer.setStyle(elm, 'pointer-events', 'auto');
    });
  }

  private disPointer(d: HTMLElement) {
    while (d.parentElement) {
      // this._dnd.selectedNode[];
      // find it is root leave
      if (d.attributes[rootId]) {
        console.log('find root');
        return;
      }
      // 找到自己的上層
      d = d.parentElement;
      if (d.attributes[sortableKey]) {
        this.stopElm.push(d);
        this._renderer.setStyle(d, 'pointerEvents', 'none');
      }
    }
  }

  private moveIndex(from, to, elm) {
    if (from !== to) {
      if (from > to) {
        this.insertBefore(elm);
      } else {
        this.insertAfter(elm);
      }
    } else {
      switch (this.prevAction) {
        case MOVE_TYPE.UP:
          this.insertAfter(elm);
          break;
        case MOVE_TYPE.DOWN:
          this.insertBefore(elm);
          break;
      }
    }
  }

  private insertBefore(getElm: number) {
    this.prevAction = MOVE_TYPE.UP;

    this._renderer.insertBefore(
      this._dnd.distinationData.container,
      this._dnd.selectedNode,
      getElm
    );
  }

  private insertAfter(getElm: any) {
    this.prevAction = MOVE_TYPE.DOWN;
    insertAfter(this._renderer, this._dnd.selectedNode, getElm);
  }

  private setSelectorElm(container: HTMLElement): HTMLElement[] {
    const elms: any[]
      = Array.from(container.querySelectorAll(`#dnd${this.data.id}>${this.elmsSelector}`));
    elms.forEach((elm: HTMLElement, index: number) => {
      this._renderer.setStyle(elm, 'pointer-events', 'auto');
      this._renderer.setAttribute(elm, indexId, `${index}`);
      this._renderer.setAttribute(elm, sortableKey, `${this.data.id}`);
      this._dnd.mask(elm, `${this.data.id}`);
    });
    return elms;
  }

  private getMoveSelector(elm: HTMLElement): any {
    if (this.moveSelector) {
      return elm.querySelector(`${this.moveSelector}`);
    }
    return elm;
  }

  private findItemNode(elm: HTMLElement): any {
    let nowElm = elm;
    while (nowElm.parentElement &&
      nowElm.parentElement.id !== this.data.container.id &&
      nowElm.parentElement.id !== this._dnd.distinationData.container.id) { nowElm = nowElm.parentElement; }
    return nowElm;
  }

  public reGetContainerElms(toIndex?) {
    setTimeout(() => {
      this.data.elms = this.setSelectorElm(this.data.container);
      if (toIndex !== undefined) {
        // console.log(toIndex);
        this.bindingHammer(this.data.elms[toIndex]);
      }
    }, 0);
  }
}
