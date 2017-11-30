import { Component, OnInit } from '@angular/core';
import { RUN_DIRECTION } from 'ngx-hm-carousel';

@Component({
  selector: 'app-drag-one',
  templateUrl: './drag-one.component.html',
  styleUrls: ['./drag-one.component.scss']
})
export class DragOneComponent {

  index = 0;
  infinite = true;
  // mourseEnable = false;
  direction: RUN_DIRECTION = RUN_DIRECTION.RIGHT;
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

  openGallery($event) {
    alert($event);
  }

  switchIndex(index) {
    this.index = index;
  }

  toggleDirection($event) {
    console.log($event);
    this.direction = this.directionToggle ? RUN_DIRECTION.RIGHT : RUN_DIRECTION.LEFT;
  }

}
