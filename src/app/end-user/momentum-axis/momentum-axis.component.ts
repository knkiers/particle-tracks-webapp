import { Component, OnInit, Input, OnChanges } from '@angular/core';

const ARROW_HEAD_WIDTH = 0.03; //width of arrow head compared to size of window (assumed square)
const ARROW_HEAD_LENGTH = 0.08; //length of arrow head compared to size of window (assumed square)
const VECTOR_FRAC = 0.8; // factor by which to shrink max vector
const PI = Math.acos(-1);

@Component({
  selector: '[app-momentum-axis]',
  templateUrl: 'momentum-axis.component.html',
  styleUrls: ['momentum-axis.component.css']
})
export class MomentumAxisComponent implements OnInit, OnChanges {

  @Input() boundaries: any;
  @Input() circles: any;
  @Input() wakeUp: number;

  hAxisParams: any;
  vAxisParams: any;
  momentumVectorParams: any;
  private arrowHeadCoords = '';

  constructor() {}

  ngOnInit() {
    console.log(this.circles);
    console.log(this.boundaries);
    this.computeAxisCoordinates();
  }

  ngOnChanges(){
    this.computeAxisCoordinates();
    console.log('change detected by momentum axis!');
  }

  computeAxisCoordinates(){

    let rmax = 0;
    let momentumVectors = [];
    this.momentumVectorParams = [];

    let xminPx = this.boundaries.xminPx;
    let xmaxPx = this.boundaries.xmaxPx;
    let yminPx = this.boundaries.yminPx;
    let ymaxPx = this.boundaries.ymaxPx;
    let xOriginPx = (xminPx+xmaxPx)/2;
    let yOriginPx = (yminPx+ymaxPx)/2;

    for (let circle of this.circles) {
      if (circle.r > rmax) {
        rmax = circle.r;
      }
    }

    rmax = rmax/VECTOR_FRAC; // so the max momentum vector doesn't extend off the diagram....
    this.arrowHeadCoords =
      (xOriginPx-(xmaxPx-xminPx)*ARROW_HEAD_LENGTH/2).toString()+
      ','+
      (yOriginPx+(ymaxPx-yminPx)*ARROW_HEAD_WIDTH/2).toString()+
      ' '+
      xOriginPx.toString()+
      ','+
      yOriginPx.toString()+
      ' '+
      (xOriginPx-(xmaxPx-xminPx)*ARROW_HEAD_LENGTH/2).toString()+
      ','+
      (yOriginPx-(ymaxPx-yminPx)*ARROW_HEAD_WIDTH/2).toString();

    console.log(this.arrowHeadCoords);


    //100,95 110,100 100,105

    for (let circle of this.circles) {
      if (circle.incoming) {
        momentumVectors.push(
          {
            xPx: xOriginPx + (circle.r / rmax) * Math.cos(circle.theta + PI) * (xmaxPx - xOriginPx),
            yPx: yOriginPx + (circle.r / rmax) * Math.sin(circle.theta + PI) * (ymaxPx - yOriginPx),
            thetaDegrees: circle.theta * 180 / PI, // for rotating arrowhead
            deltaxPx: 0,
            deltayPx: 0
          }
        );
      } else {
        momentumVectors.push(
          {
            xPx: xOriginPx + (circle.r / rmax) * Math.cos(circle.theta) * (xmaxPx - xOriginPx),
            yPx: yOriginPx + (circle.r / rmax) * Math.sin(circle.theta) * (ymaxPx - yOriginPx),
            thetaDegrees: circle.theta * 180 / PI, // for rotating arrowhead
            deltaxPx: (circle.r / rmax) * Math.cos(circle.theta) * (xmaxPx - xOriginPx),//for shifting arrowhead
            deltayPx: (circle.r / rmax) * Math.sin(circle.theta) * (ymaxPx - yOriginPx)//for shifting arrowhead
          }
        );
      }
    }

    for (let mV of momentumVectors) {
      this.momentumVectorParams.push(
        {
          x1: xOriginPx,
          y1: yOriginPx,
          x2: mV.xPx,
          y2: mV.yPx,
          arrowHeadTranslateRotate:
            'translate('+
            (mV.deltaxPx).toString()+
            ' '+
            (mV.deltayPx).toString()+
            ') rotate('+
            (-1*mV.thetaDegrees).toString()+
            ' '+
            xOriginPx.toString()+
            ' '+
            yOriginPx.toString()+
            ')'
        }
      )
    }

    console.log(this.momentumVectorParams);

    this.hAxisParams = {
      x1: xminPx,
      y1: yOriginPx,
      x2: xmaxPx,
      y2: yOriginPx
    };

    this.vAxisParams = {
      x1: xOriginPx,
      y1: yminPx,
      x2: xOriginPx,
      y2: ymaxPx
    };

  }

  lineColor(i: number){
    if (this.circles[i].hovered) {
      return 'red';
    } else {
      return 'grey';
    }
  }

  strokeWidth(i: number){
    if (this.circles[i].hovered) {
      return 3;
    } else {
      return 2;
    }
  }

}


/*
 <svg:polygon
 [attr.points]="'100,95 110,100 100,105'"
 style="fill:lime;stroke:purple;stroke-width:1"
 [attr.transform]="'translate(30 -30) rotate(-45 100 100)'"/>
 */
