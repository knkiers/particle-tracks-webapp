import { Injectable } from '@angular/core';
import { Subject , Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import {Http, Response, Headers} from '@angular/http';
import {Router} from '@angular/router';

import {EventUrl} from './urls';
import {EventTypeUrl} from './urls';
import {POINT_THREE} from './unit-conversion.service';

import {Event} from '../models/event';
import {UnitConversionService} from './unit-conversion.service';
import {UserService} from './user.service';

@Injectable()
export class EventDisplayService {

  // Observable source
  private gridActivationAnnouncedSource = new Subject();

  // Observable stream
  gridActivationAnnounced$ = this.gridActivationAnnouncedSource.asObservable();

  constructor(
    private http:Http,
    private unitConversionService:UnitConversionService,
    private userService: UserService,
    private router: Router) {}

  // this looks helpful for using tokens: https://github.com/auth0-blog/angular2-http
  // also: http://stackoverflow.com/questions/34464108/angular2-set-headers-for-every-request
  // ...and: https://auth0.com/blog/angular-2-series-part-3-using-http/
  // request options (from Angular 2 docs; experimental): https://angular.io/docs/ts/latest/api/http/index/RequestOptions-class.html
  getEvent(): Observable<Event> {
    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/
    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    console.log(headers);
    console.log(EventTypeUrl);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    return this.http
      .get(EventUrl, {headers})
      .pipe(
        map(response => response.json())
      );
  }


  // Service message command
  announceGridActivation(gridIndices: number[]) {
    this.gridActivationAnnouncedSource.next(gridIndices);
  }

//  getEvent() {
//    console.log(EventUrl);
//    this.http
//      .get(EventUrl)
//      .map((response:Response) => response.json());
//  }
  getStringEventDisplay(bFieldStrength, bFieldDirection,
                        dots,
                        boundaries, interactionLocation,
                        event){

    var inChargedString = '';
    var inNeutralString = '';
    var outChargedString = '';
    var outNeutralString = '';
    var particleDirection;
    var px, py, pathParams;
    var activatedGridIndices = [];

    px = event.parent.energy_momentum[1];
    py = event.parent.energy_momentum[2];

    if (event.parent.charge != 0) {
      particleDirection = this.inOut(bFieldDirection, event.parent.charge);
      pathParams = this.curvedPathParams(bFieldStrength, dots, boundaries, interactionLocation,
        px, py, particleDirection, 'incoming');
      inChargedString += pathParams.string;
      activatedGridIndices = this.concatenateTwoArrays(activatedGridIndices,pathParams.activatedDots);
    } else {
      inNeutralString += this.straightPathParams(boundaries, interactionLocation, px, py, 'incoming');
    }
    var dP;
    for (var i=0; i<event.decay_products.length; i++) {
      dP = event.decay_products[i];
      px = dP.energy_momentum[1];
      py = dP.energy_momentum[2];
      if (dP.charge != 0) {
        particleDirection = this.inOut(bFieldDirection, dP.charge);
        pathParams = this.curvedPathParams(bFieldStrength, dots, boundaries, interactionLocation,
          px, py, particleDirection, 'outgoing');
        outChargedString += pathParams.string;
        activatedGridIndices = this.concatenateTwoArrays(activatedGridIndices,pathParams.activatedDots);
      } else {
        outNeutralString += this.straightPathParams(boundaries, interactionLocation, px, py, 'outgoing');
      }
    }

    // let AnalysisDisplayComponent know about the activated dots via a subscription....
    this.announceGridActivation(activatedGridIndices);

    var dString = {'inCharged': inChargedString, 'inNeutral': inNeutralString,
      'outCharged': outChargedString, 'outNeutral': outNeutralString};
    return dString;

  }

  concatenateTwoArrays(array1, array2){
    var returnArray = []
    for (let el of array1) {
      returnArray.push(el);
    }
    for (let el of array2) {
      returnArray.push(el);
    }
    return returnArray;
  }

  inOut(bFieldDirection, charge){
    if ((charge == 1 && bFieldDirection == 'in') || (charge == -1 && bFieldDirection == 'out')){
      return 'ccw';
    } else {
      return 'cw';
    }
  }

  /**
   * @desc - direction is 'cw' or 'ccw', depending on the particle direction
   *       - inout is 'incoming' or 'outgoing'
   *       - (x0, y0) is the center of the circle
   *       - phi0 the angle from (x0, y0) to the interaction point, measured
   *         positive relative to the +x axis
   */
  curvedPathParams(b_field, dots, boundaries,
                   interactionLocation, px, py,
                   direction, inout) {
    var p = Math.sqrt(px*px+py*py);
    var r = p/(POINT_THREE*b_field);
    var phi0, x0, y0, phiBorder;
    var PI = Math.acos(-1);
    var returnString, returnDict;
    var activatedDots;

    if (direction == 'ccw') {
      phi0 = Math.atan2(-px, py); // phi0 = tan((-px)/py)
    } else {
      phi0 = Math.atan2(px, -py); // phi0 = tan(px/(-py))
    }
    x0 = interactionLocation.x - r*Math.cos(phi0);
    y0 = interactionLocation.y - r*Math.sin(phi0);

    phiBorder = this.boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout);

    returnString = this.arcString(x0, y0, r, phi0, phiBorder, boundaries, direction, inout);
    activatedDots = this.activateDots(dots, x0, y0, r, phi0, phiBorder, boundaries, direction, inout);

    console.log('inside curvedpathparams');
    console.log(activatedDots);
    returnDict = {
      string: returnString,
      activatedDots: activatedDots
    };
    console.log(returnDict);
    return returnDict;

  }

  /**
   * @desc determines the string that will create the arc in SVG
   * @inputs - r is the radius of the circle
   *         - boundaries contains the boundaries of the region
   *         - (x0, y0) is the center of the circle
   *         - phi0 is the angle between (x0, y0) and the interactionLocation
   *         - direction is 'cw' or 'ccw', depending on the particle direction
   *         - inout is 'incoming' or 'outgoing'
   * @returns string
   */
  arcString(x0, y0, r, phi0, phiBorder, boundaries, direction, inout) {
    var PI = Math.acos(-1);

    var largeArcFlag = '0';
    var sweepFlag;
    var absDeltaPhi = Math.abs(phi0 - phiBorder);

    if (direction == 'ccw') {
      sweepFlag = '0';
    } else {
      sweepFlag = '1';
    }

    if (inout == 'incoming') {
      var xFinal = x0 + r*Math.cos(phi0);
      var yFinal = y0 + r*Math.sin(phi0);
      var xInitial = x0 + r*Math.cos(phiBorder);
      var yInitial = y0 + r*Math.sin(phiBorder);
    } else {
      var xInitial = x0 + r*Math.cos(phi0);
      var yInitial = y0 + r*Math.sin(phi0);
      var xFinal = x0 + r*Math.cos(phiBorder);
      var yFinal = y0 + r*Math.sin(phiBorder);
    }

    if (absDeltaPhi > PI) {
      largeArcFlag = '1';
    }

    var pixelFinal = this.unitConversionService.translatecmtoPixels(xFinal, yFinal, boundaries);
    var pixelInitial = this.unitConversionService.translatecmtoPixels(xInitial, yInitial, boundaries);
    var rPixels = this.unitConversionService.translateRadiuscmtoPixels(r, boundaries);
    var arrayToStringify = ['M', pixelInitial.x, pixelInitial.y, 'A', rPixels.toString(), rPixels.toString(),
      '0', largeArcFlag, sweepFlag, pixelFinal.x, pixelFinal.y];
    var arcString = this.stringifyArray(arrayToStringify);
    return arcString;
  }

  straightPathString(xInteraction, yInteraction, xEdge, yEdge, boundaries, inout) {

    var pixelEdge = this.unitConversionService.translatecmtoPixels(xEdge, yEdge, boundaries);
    var pixelInteraction = this.unitConversionService.translatecmtoPixels(xInteraction, yInteraction, boundaries);

    var arrayToStringify = ['M', pixelInteraction.x, pixelInteraction.y, 'L', pixelEdge.x, pixelEdge.y];
    var lineString = this.stringifyArray(arrayToStringify);
    return lineString;
  }

  straightPathParams(boundaries, interactionLocation, px, py, inout) {
    // find x and y for intersection with boundary
    // call straightPathString and then return returnString
    var returnString, edgeCoords;

    edgeCoords = this.boundaryIntersectionStraight(interactionLocation.x,
      interactionLocation.y,
      px, py, boundaries, inout);

    returnString = this.straightPathString(interactionLocation.x,
      interactionLocation.y,
      edgeCoords.x,
      edgeCoords.y, boundaries, inout);
    return returnString;

  }

  /**
   * @desc determines the first angle at which the circle in question intersects
   *       with a boundary; if there is no intersection by |Delta phi| = 3 pi/2, then
   *       a value is put in by hand to correspond to |Delta phi| = 3 pi/2
   * @inputs - r is the radius of the circle
   *         - boundaries contains the boundaries of the region
   *         - (x0, y0) is the center of the circle
   *         - direction is 'cw' or 'ccw'; gives the physical direction being traveled by the particle
   *         - inout is 'incoming' or 'outgoing'
   * @note for an incoming particle, travels backward along the route until a boundary is reached;
   *       for an outgoing particle, travels forward along the route until a boundary is reached
   * @returns phi value
   */
  boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout) {
    var phi;
    var PI = Math.acos(-1);
    var deltaPhiMax = 3*PI/2;
    var phiStep = 0.01; //radians
    var signStep;
    var x, y;
    x = x0 + r*Math.cos(phi0); // this is the interaction point
    y = y0 + r*Math.sin(phi0);
    if (!this.isInsideBoundingBox(x, y, boundaries)){
      return phi0;// hopefully this doesn't happen(!)
    }

    var inside = true;
    phi = phi0;
    var deltaPhi = 0;
    if ((direction == 'ccw' && inout == 'incoming') || (direction == 'cw' && inout == 'outgoing')) {
      signStep = -1;
    } else {
      signStep = 1;
    }

    while (inside == true && Math.abs(deltaPhi) < deltaPhiMax) {
      deltaPhi += signStep*phiStep;
      phi = phi0 + deltaPhi;
      x = x0 + r*Math.cos(phi);
      y = y0 + r*Math.sin(phi);
      inside = this.isInsideBoundingBox(x, y, boundaries);
    }
    // phi now corresponds to a point slightly outside the bounding box, so reset it
    phi = phi - signStep*phiStep;
    return phi;
  }


  boundaryIntersectionStraight(xInteraction, yInteraction, px, py, boundaries, inout) {

    var unitX = px/Math.sqrt(px*px+py*py);
    var unitY = py/Math.sqrt(px*px+py*py);
    var edgeCoords;
    var nStep = 0.01; //cm
    var signStep;
    var x, y;
    if (!this.isInsideBoundingBox(xInteraction, yInteraction, boundaries)){
      edgeCoords = {'x': xInteraction, 'y': yInteraction};
      return edgeCoords;// hopefully this doesn't happen(!)
    }
    var inside = true;
    if (inout == 'incoming'){
      signStep = -1;
    } else {
      signStep = 1;
    }
    x = xInteraction;
    y = yInteraction;
    while (inside == true) {
      x += unitX*signStep*nStep;
      y += unitY*signStep*nStep;
      inside = this.isInsideBoundingBox(x, y, boundaries);
    }
    // (x,y) now corresponds to a point slightly outside the bounding box, so reset it
    x -= unitX*signStep*nStep;
    y -= unitY*signStep*nStep;
    edgeCoords = {'x': x, 'y': y};
    return edgeCoords;
  }

  stringifyArray(array) {
    var returnString = '';
    var i;
    for (i=0; i<array.length; i++) {
      returnString += array[i]+' ';
    }
    return returnString;
  }

  /**
   * @desc determines whether or not a given coordinate is inside the bounding region
   * @inputs - (x, y) are the coordinates of the point in question (in cm)
   *         - boundaries contains the boundaries of the region
   * @returns boolean
   */
  isInsideBoundingBox(x, y, boundaries) {
    if (x < boundaries.xmax &&
      x > boundaries.xmin &&
      y < boundaries.ymax &&
      y > boundaries.ymin) {
      return true;
    } else {
      return false;
    }
  }

  // given a particular arc, activates all of the dots that are close to it
  activateDots(dots, x0, y0, r, phi0, phiBorder, boundaries, direction, inout) {
    var rdot;
    var phi;
    var test;
    var activatedDots = []; // will contain a list of the indices of the dots that should be activated
    for (var i=0; i<dots.length; i++) {
      rdot = Math.sqrt((x0-dots[i].xcm)*(x0-dots[i].xcm)+(y0-dots[i].ycm)*(y0-dots[i].ycm));
      if (Math.abs(rdot-r) <= boundaries.deltaR) {
        phi = Math.atan2(dots[i].ycm-y0, dots[i].xcm-x0);
        if ((inout == 'incoming' && direction == 'ccw') || (inout == 'outgoing' && direction == 'cw')) {
          if(this.angleWithinArc(phiBorder, phi, phi0)){
            //dots[i].activated = true;
            activatedDots.push(i);
          }
        } else {
          if(this.angleWithinArc(phi0, phi, phiBorder)){
            //dots[i].activated = true;
            activatedDots.push(i);
          }
        }
      }
    }
    return activatedDots;
  }

  // determines whether or not phitest is within the arc between phismall and philarge;
  // it is assumed that phismall < philarge and that they are on the same branch;
  // phitest is increased or decreased by increments of 2 pi to see if it can be placed between
  // phismall and philarge; function returns true or false
  angleWithinArc(phismall, phitest, philarge) {
    if (phismall>philarge) {
      return false;
    }
    if (philarge > phitest && phitest > phismall) {
      return true;
    }
    // phitest is currently outside the acceptable range, but maybe could be put
    // inside if incremented in units of 2pi....
    var twopi = 2*Math.acos(-1);
    if (phitest > philarge) {
      while (phitest > philarge) {
        phitest -= twopi;
      }
      if (phitest > phismall) {
        return true;
      } else {
        return false;
      }
    } else if (phitest < phismall) {
      while (phitest < phismall) {
        phitest += twopi;
      }
      if (phitest < philarge) {
        return true;
      } else {
        return false;
      }
    }
    // I don't think it should ever get here, but just in case....
    return false;
  }

}
