import { Component, OnInit, Input } from '@angular/core';

import { CircleBindingService } from '../circle-binding.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-circle-table',
  templateUrl: 'circle-table.component.html',
  styleUrls: ['circle-table.component.css']
})
export class CircleTableComponent implements OnInit {

  // WORKING HERE: next...when hovering/unhovering a table, change the dots
  // in the dotIndices array to be red/not red via the circle binding service, etc.

  @Input() circles: any;
  @Input() event: any;
  @Input() userIsReadOnly: boolean = false;

  constructor(private circleBindingService:CircleBindingService) {}

  ngOnInit() {
  }

  deleteCircle(i: number){
    var updateData = {
      index: i,
      command: 'delete'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }

  highlightCircle(i: number){
    console.log('hovering me!');
    var updateData = {
      index: i,
      command: 'hover'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }

  unhighlightCircle(i: number){
    console.log('unhovering me!');
    var updateData = {
      index: i,
      command: 'unhover'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }

  toggleRotationDirection(i: number){
    console.log('toggle rotn dirn!');
    var updateData = {
      index: i,
      command: 'toggleRotationDirection'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }

  toggleIncomingOutgoing(i: number){
    console.log('toggle particle dirn!');
    var updateData = {
      index: i,
      command: 'toggleIncomingOutgoing'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }


}
