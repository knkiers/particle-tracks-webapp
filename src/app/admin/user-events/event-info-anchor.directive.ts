import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appEventInfoAnchor]'
})
export class EventInfoAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
