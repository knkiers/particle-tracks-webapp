import { Component, OnInit, Input } from '@angular/core';

import {UnitConversionService} from '../../shared/services/unit-conversion.service';

const axisFraction = 0.8;

@Component({
  selector: '[app-axis]',
  templateUrl: 'axis.component.html',
  styleUrls: ['axis.component.css']
})
export class AxisComponent implements OnInit {

  @Input() boundaries: any;
  @Input() interactionLocation: any;
  hAxisParams: any;
  vAxisParams: any;

  constructor(private unitConversionService:UnitConversionService) {}

  ngOnInit() {
    console.log('inside axis component');
    console.log(this.boundaries);
    console.log(this.interactionLocation);
    this.computeAxisCoordinates();
  }

  computeAxisCoordinates(){
    let xmin = this.boundaries.xmin;
    let xmax = this.boundaries.xmax;
    let ymin = this.boundaries.ymin;
    let ymax = this.boundaries.ymax;
    let x = this.interactionLocation.x;
    let y = this.interactionLocation.y;

    let axisLength = (Math.min(xmax-x, x-xmin, ymax-y, y-ymin))*axisFraction;
    //console.log(axisLength);

    // in the following, x and y are not really the x and y coords of a single point, but
    // that turns out not to matter for the conversion of the coordinates....
    var hLineStart = this.unitConversionService.translatecmtoPixels(x-axisLength, y, this.boundaries);
    var hLineEnd = this.unitConversionService.translatecmtoPixels(x+axisLength, y, this.boundaries);
    var vLineStart = this.unitConversionService.translatecmtoPixels(x, y-axisLength, this.boundaries);
    var vLineEnd = this.unitConversionService.translatecmtoPixels(x, y+axisLength, this.boundaries);


    this.hAxisParams = {
      x1: hLineStart.x,
      y1: hLineStart.y,
      x2: hLineEnd.x,
      y2: hLineEnd.y
    };

    this.vAxisParams = {
      x1: vLineStart.x,
      y1: vLineStart.y,
      x2: vLineEnd.x,
      y2: vLineEnd.y
    };
  }



}
