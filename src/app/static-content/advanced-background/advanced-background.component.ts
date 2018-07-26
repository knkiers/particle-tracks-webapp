import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-advanced-background',
  templateUrl: './advanced-background.component.html',
  styleUrls: ['./advanced-background.component.css']
})
export class AdvancedBackgroundComponent implements OnInit {
  @ViewChild('footnotes') footnotesSection
  @ViewChild('fn1Source') fn1Source
  @ViewChild('fn2Source') fn2Source
  @ViewChild('fn3Source') fn3Source
  @ViewChild('fn4Source') fn4Source
  @ViewChild('fn5Source') fn5Source

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
      case 'fn4': {
        this.fn4Source.nativeElement.scrollIntoView();
        break;
      }
      case 'fn5': {
        this.fn5Source.nativeElement.scrollIntoView();
        break;
      }
      default: {
        //statements;
        break;
     }
   }
 }
}
