import { Component, OnInit } from '@angular/core';

import {NeutralDecaysComponent} from '../../shared/static-content/neutral-decays/neutral-decays.component';
import {ChargedDecaysComponent} from '../../shared/static-content/charged-decays/charged-decays.component';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
