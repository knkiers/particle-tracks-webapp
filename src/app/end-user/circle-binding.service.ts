import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class CircleBindingService {

  constructor() {}

  // Observable string sources
  private circleUpdatedSource = new Subject<any>();

  // Observable string streams
  circleUpdated$ = this.circleUpdatedSource.asObservable();

  // Service message commands
  announceCircleUpdate(updateData) {
    console.log('inside service');
    console.log(updateData);
    this.circleUpdatedSource.next(updateData);
  }

}
