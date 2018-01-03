import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';

/**
 *
 * This service deals with everything having to do with initialization, constants, units,
 * conversion between units, etc.
 *
 */

const BOUNDARIES = { // very important that the x and y directions preserve the aspect ratio!!!
  xmin: -20, // cm; boundaries of the display region
  xmax: 20,  // cm
  ymin: -20, // cm
  ymax: 20,  // cm
  numGridPointsX: 61, // the number of grid points in the x direction; must be at least 2
  numGridPointsY: 61,
  height: 420,
  width: 420,
  heightDisplay: 400, // heightDisplay = yminPx - ymaxPx
  widthDisplay: 400, // widthDisplay = xmaxPx - xminPx
  xminPx: 10, // boundaries of the display region in pixels
  xmaxPx: 410, // pixels
  yminPx: 410, // pixels; yminPx is at the bottom of the plot region
  ymaxPx: 10, // pixels
  deltaR: 0.2 // cm; radial distance from a track within which a "dot" in the grid will be activated
};

const MOMENTUM_DIAGRAM_BOUNDARIES = {
  height: 200,
  width: 200,
  heightDisplay: 150, // heightDisplay = yminPx - ymaxPx
  widthDisplay: 150, // widthDisplay = xmaxPx - xminPx
  xminPx: 25,
  xmaxPx: 175,
  yminPx: 175,
  ymaxPx: 25
}

const INTERACTION_REGION = {// this is the region within which the interaction point can occur
  xmin: -1,
  xmax: 1,
  ymin: -1,
  ymax: 1
}

/**
 *
 * The following constant is used in the expression:
 *
 *    p = 0.299792*B*r,
 *
 * which gives the momentum (in MeV/c) if B and r are in kG and cm, respectively.
 *
 */

export const POINT_THREE = 0.299792;

@Injectable()
export class UnitConversionService {

  constructor() {}

  initializeGrid(boundaries) {

    var deltaX = (boundaries.xmax-boundaries.xmin)/(boundaries.numGridPointsX-1);
    var deltaY = (boundaries.ymax-boundaries.ymin)/(boundaries.numGridPointsY-1);

    var grid = [];

    var x, y;
    var i, j, coordsPx;
    var index = 0;
    for (j=0; j<boundaries.numGridPointsY; j++) {
      for (i=0; i<boundaries.numGridPointsX; i++) {
        x = boundaries.xmin + i*deltaX;
        y = boundaries.ymin + j*deltaY;
        coordsPx = this.translatecmtoPixels(x, y, boundaries);
        grid.push(
          {
            id:     index,
            activated: false,
            x:         coordsPx.x,
            y:         coordsPx.y,
            xcm:       x,
            ycm:       y,
            useForFit: false,
          }
        );
        index++;
      }
    }
    return grid;
  }


  getGrid(){
    var grid = this.initializeGrid(BOUNDARIES);
    var promise = Promise.resolve(grid);// Observable.just(DOTS);
    //var promise = Promise.resolve(DOTS);// Observable.just(DOTS);
    return Observable.fromPromise(promise);
  }

  getBoundaries(){
    var promise = Promise.resolve(
      {boundaries: BOUNDARIES, momentumDiagramBoundaries: MOMENTUM_DIAGRAM_BOUNDARIES});
    return Observable.fromPromise(promise);
  }

  getInteractionRegion(){
    var promise = Promise.resolve(INTERACTION_REGION);
    return Observable.fromPromise(promise);
  }

  translateCircleDatatoPixels(circleDatacm, boundaries, dotIndices) {
    var center = this.translatecmtoPixels(circleDatacm.xc, circleDatacm.yc, boundaries);
    var r = this.translateRadiuscmtoPixels(circleDatacm.r, boundaries);
    var circleDataPx = {
      xcPx: center.x,
      ycPx: center.y,
      rPx:  r,
      xc:   circleDatacm.xc,
      yc:   circleDatacm.yc,
      r:    circleDatacm.r,
      CW:   true,
      incoming: true,
      hovered: false,
      dotIndices: dotIndices,
      theta: null// eventually the (approx.) angle (in radians) of the momentum vector
    };
    return circleDataPx;
  }

  translatecmtoPixels(x, y, boundaries) {
    var xPx = boundaries.xminPx +
      (x-boundaries.xmin)*(boundaries.xmaxPx-boundaries.xminPx)/
      (boundaries.xmax-boundaries.xmin);

    var yPx = boundaries.yminPx -
      (y-boundaries.ymin)*(boundaries.yminPx-boundaries.ymaxPx)/
      (boundaries.ymax-boundaries.ymin);

    var pixelCoordsString = {'x': xPx.toString(), 'y': yPx.toString()};
    return pixelCoordsString;
  }

  translateRadiuscmtoPixels(r, boundaries) {//assume aspect ratio is 1!!!
    return r*(boundaries.xmaxPx-boundaries.xminPx)/(boundaries.xmax-boundaries.xmin);
  }









}
