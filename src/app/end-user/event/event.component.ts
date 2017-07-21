import { Component, OnInit, Input } from '@angular/core';
//import {EventDisplayService} from '../../shared/services/event-display.service';
//import {UnitConversionService} from '../../shared/services/unit-conversion.service';
//import {EventAnalysisService} from '../../shared/services/event-analysis.service';
//import {Event} from '../../shared/models/event';


@Component({
  selector: '[app-event]',
  templateUrl: 'event.component.html',
  styleUrls: ['event.component.css'],
  //providers: [UnitConversionService],
})
export class EventComponent implements OnInit {

  @Input() eventDisplay: any;
  @Input() dots: any;

  //private boundaries: any;
  //private interactionRegion: any;
  //private interactionLocation: any;
  //private display;

  constructor() {}

  ngOnInit() {}



}
