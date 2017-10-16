import { Injectable } from '@angular/core';

import {Http, Response, Headers} from '@angular/http';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';


import {AnalyzedEventsUrl, UserEventsUrl} from './urls';

import {UnitConversionService} from './unit-conversion.service';
import {UserService} from './user.service';

@Injectable()
export class EventAnalysisService {

  // Observable sources
  private tokenExpiredSource = new Subject<any>();
  private analysisDisplayClosedSource = new Subject<any>();

  // Observable streams
  tokenExpired$ = this.tokenExpiredSource.asObservable();
  analysisDisplayClosed$ = this.analysisDisplayClosedSource.asObservable();

  constructor(private http:Http,
              private unitConversionService:UnitConversionService,
              private router: Router,
              private userService: UserService) {}

  /*
   looks at the 'gridItemList' array and determines which have been selected for fitting a circle;
   returns a data list suitable for sending to circleFitter
   */
  fitCircleToData(dots, boundaries) {
    var circleInputData = this.gatherDataFromDots(dots);
    var dotIndices = circleInputData.dotIndices;

    var circleDatacm = this.circleFitter(circleInputData);
    var error = false;
    var errorMessage = '';
    var dataDict;
    var circleDataPx;
    if (circleDatacm.error) {
      errorMessage = circleDatacm.errorMessage;
      error = true;
    } else {
      circleDataPx = this.unitConversionService.translateCircleDatatoPixels(circleDatacm, boundaries, dotIndices);
    }
    dataDict = {
      circle:      circleDataPx,
      error:        error,
      errorMessage: errorMessage
    };
    return dataDict;
  }

  /*
   * @name circleFitter
   * @input data has two lists: data.x and data.y
   * @returns (x0, y0) and r (in cm) for the best-fit circle
   * @algorithm: http://www.dtcenter.org/met/users/docs/write_ups/circle_fit.pdf
   *
   * @note: the routine checks for colinear points, and that N >= 3.
   */
  circleFitter(data) {
    var xBar = this.mean(data.x);
    var yBar = this.mean(data.y);
    var uList = [];
    var vList = [];
    var nMax = data.x.length;
    var i;
    var circleData;

    if (nMax < 3 ) {
      circleData = {xc: 0, yc: 0, r: 0,
        error: true,
        errorMessage: 'You must choose at least three points.'
      };
      return circleData;
    }

    for (i=0; i < nMax; i++) {
      uList.push(data.x[i] - xBar);
      vList.push(data.y[i] - yBar);
    }

    var Suu =  this.SCalculator([uList, uList]);
    var Svv =  this.SCalculator([vList, vList]);
    var Suv =  this.SCalculator([uList, vList]);
    var Suuu = this.SCalculator([uList, uList, uList]);
    var Svvv = this.SCalculator([vList, vList, vList]);
    var Suvv = this.SCalculator([uList, vList, vList]);
    var Svuu = this.SCalculator([vList, uList, uList]);

    var mInv = this.inverseTwoByTwo([[Suu, Suv], [Suv, Svv]]);
    if (mInv.error) {
      circleData = {xc: 0, yc: 0, r: 0,
        error: true,
        errorMessage: 'You must choose non-colinear points.'
      };
    } else {
      var inverseMatrix = mInv.inverse;
      var coeffs = [(Suuu+Suvv)/2, (Svvv+Svuu)/2];
      var uc = inverseMatrix[0][0]*coeffs[0]+inverseMatrix[0][1]*coeffs[1];
      var vc = inverseMatrix[1][0]*coeffs[0]+inverseMatrix[1][1]*coeffs[1];
      var xc = uc + xBar;
      var yc = vc + yBar;
      var r = Math.sqrt(uc*uc + vc*vc + (Suu+Svv)/nMax);
      circleData = {xc: xc, yc: yc, r: r, error: false, errorMessage: ''};
    }
    return circleData;
  }

  mean(list) {
    var total = 0;
    var i;
    for (i=0; i<list.length; i++) {
      total += list[i];
    }
    return total/list.length;
  }

  /*
   * listOfLists could be [uList, uList, vList], for example
   *
   */
  SCalculator(listOfLists) {
    var numLists = listOfLists.length;
    var i, j;
    var sublistLengths = listOfLists[0].length; //they'd better be the same length!
    var total = 0;
    var product;
    for (j=0; j < sublistLengths; j++){
      product = 1;
      for (i=0; i < numLists; i++){
        product = product*listOfLists[i][j];
      }
      total += product;
    }
    return total;
  }

  /*
   * MUST CHECK FIRST that the matrix is invertible!!!
   *
   */
  inverseTwoByTwo(matrix) {
    var a,b,c,d;
    var eps = 0.000000001;
    var error = false;
    var returnObject;
    a = matrix[0][0];
    b = matrix[0][1];
    c = matrix[1][0];
    d = matrix[1][1];
    var det = a*d - b*c;
    if (Math.abs(det) < eps) {
      returnObject = {
        error: true,
        inverse: 0
      };
      return returnObject;
    } else {
      var inverse = [[d/det, -b/det],[-c/det, a/det]];
      returnObject = {
        error: false,
        inverse: inverse
      };
      return returnObject;
    }

  }





  gatherDataFromDots(dots: any) {
    var xArray = [];
    var yArray = [];
    var dotIndices = [];

    for (let i in dots) {
      //console.log(dots[i]);
      if (dots[i].useForFit === true) {
        xArray.push(dots[i].xcm);
        yArray.push(dots[i].ycm);
        dotIndices.push(+i);//'+' converts string to number
      }
    }
    var circleInputData = {
      x: xArray,
      y: yArray,
      dotIndices: dotIndices
    }
    return circleInputData;
  }

  computeTangentAngle(axisLocation, circle) {
    var theta;
    var PI = Math.acos(-1);
    var phi = Math.atan2(axisLocation.y-circle.yc, axisLocation.x-circle.xc);
    if (!circle.CW) {
      theta = (phi+PI/2+2*PI) % (2*PI);
    } else {
      theta = (phi+3*PI/2+2*PI) % (2*PI);
    }
    return theta;
  }



  saveAnalyzedEvent(title: string, data) {
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    let eventData = JSON.stringify(data);

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    return this.http
      .post(
        AnalyzedEventsUrl,
        JSON.stringify({
          'title': title,
          'event_data': eventData
        }),
        { headers }
      )
      .map(res => res.json());
  }

  /**
   * fetches analyzed events for the logged in user
   * @returns {Observable<R>}
   */
  getAnalyzedEvents() {
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    return this.http
      .get(UserEventsUrl, {headers})
      .map(response => response.json());

  }

  getAnalyzedEvent(id: number) {
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    return this.http
      .get(AnalyzedEventsUrl+id+'/', {headers})
      .map(response => response.json());

  }

  /**
   *
   * fetches an array of analyzed events; events could be for a user
   * other than the logged-in user (who should be an admin to use this method)
   *
   * see: https://stackoverflow.com/questions/35676451/observable-forkjoin-and-array-argument
   *
   * @param idList
   * @returns {any}
   */
  getAnalyzedUserEvents(idList: number[]): Observable<Array<any>> {
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    let observableBatch = [];
    idList.forEach(id => {
      observableBatch.push(
        this.http
          .get(AnalyzedEventsUrl+id+'/', {headers})
          .map(response => response.json()));
    });
    return Observable.forkJoin(observableBatch);
  }

  submitAnalyzedEvent(title: string, data, id, submit: boolean) {
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    let eventData = JSON.stringify(data);

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    if (this.userService.tokenExpired()) {
      this.tokenExpiredSource.next(null);
      this.router.navigate(['/login']);
    }

    return this.http
      .put(
        AnalyzedEventsUrl+id+'/',
        JSON.stringify({
          'title': title,
          'event_data': eventData,
          'submitted': submit
        }),
        { headers }
      )
      .map(res => res.json());
  }

  announcedAnalysisDisplayClosed() {
    this.analysisDisplayClosedSource.next(null);
  }



  /*
  clearDotsForFit(dots) {
    var i;
    for (i=0; i<dots.length; i++) {
      dots[i].useForFit = false;
    }
  }
  */


}
