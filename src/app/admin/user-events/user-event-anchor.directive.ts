import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUserEventAnchor]'
})
export class UserEventAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
