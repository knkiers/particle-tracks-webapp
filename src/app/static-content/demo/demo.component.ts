import { Component, OnInit } from '@angular/core';
import {NeutralDecaysComponent} from '../../shared/static-content/neutral-decays/neutral-decays.component';
import {ChargedDecaysComponent} from '../../shared/static-content/charged-decays/charged-decays.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
