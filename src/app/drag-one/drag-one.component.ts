import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NgxHmRUN_DIRECTION } from '../ngx-hm-carousel/ngx-hm-carousel.component';

@Component({
  selector: 'app-drag-one',
  templateUrl: './drag-one.component.html',
  styleUrls: ['./drag-one.component.scss']
})
export class DragOneComponent {

  index = 0;
  infinite = true;
  // mourseEnable = false;
  direction: NgxHmRUN_DIRECTION = NgxHmRUN_DIRECTION.RIGHT;
  directionToggle = true;
  autoplay = true;

  avatars = [
    {
      name: 'coffee',
      url: 'https://www.w3schools.com/w3images/coffee.jpg',
    },
    {
      name: 'mist',
      url: 'https://www.w3schools.com/w3images/mist.jpg',
    },
    {
      name: 'workbench',
      url: 'https://www.w3schools.com/w3images/workbench.jpg',
    },
    {
      name: 'bridge',
      url: 'https://www.w3schools.com/w3images/bridge.jpg',
    },
    {
      name: 'woods',
      url: 'https://www.w3schools.com/w3images/woods.jpg',
    },
  ];

  constructor(public snackBar: MatSnackBar) { }

  openGallery($event) {
    this.snackBar.open(`You click ${$event}`, 'close', {
      duration: 3000,
    });

  }

  switchIndex(index) {
    this.index = index;
  }

  toggleDirection($event) {
    this.direction = this.directionToggle ? NgxHmRUN_DIRECTION.RIGHT : NgxHmRUN_DIRECTION.LEFT;
  }

}

