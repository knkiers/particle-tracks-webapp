import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-circle-item]',//apparently the square brackets are necessary b/c this is css styling(?)
  templateUrl: 'circle-item.component.html',
  styleUrls: ['circle-item.component.css']
})
export class CircleItemComponent implements OnInit {

  @Input() params: any;

  constructor() {}

  ngOnInit() {
    console.log('got to app-circle-item!');
  }

  circleColor(){
    if (this.params.hovered) {
      return 'red';
    } else {
      return 'grey';
    }
  }

  strokeWidth(){
    if (this.params.hovered) {
      return 3;
    } else {
      return 2;
    }
  }
}
