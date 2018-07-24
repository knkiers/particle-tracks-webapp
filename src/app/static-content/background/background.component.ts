import { Component, OnInit, ViewChild } from '@angular/core';

import {NeutralDecaysComponent} from '../../shared/static-content/neutral-decays/neutral-decays.component';
import {ChargedDecaysComponent} from '../../shared/static-content/charged-decays/charged-decays.component';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {
  @ViewChild('footnotes') footnotesSection
  @ViewChild('fn1Source') fn1Source
  @ViewChild('fn2Source') fn2Source
  @ViewChild('fn3Source') fn3Source

  constructor() { }

  ngOnInit() {
  }

  gotoFootnotesSection() {
    this.footnotesSection.nativeElement.scrollIntoView();
  }

  goBackToText(fnNumber: string) {
    switch(fnNumber) {
      case 'fn1': {
        this.fn1Source.nativeElement.scrollIntoView();
        break;
      }
      case 'fn2': {
        this.fn2Source.nativeElement.scrollIntoView();
        break;
      }
      case 'fn3': {
        this.fn3Source.nativeElement.scrollIntoView();
        break;
      }
      default: {
        //statements;
        break;
     }
   }
 }
}
