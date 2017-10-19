import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
//import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
//import {FormsModule} from '@angular/forms';

//import {MaterializeDirective} from "angular2-materialize";

import {MaterializeDirective,MaterializeAction} from "angular2-materialize";

import {EventDisplayService} from '../../shared/services/event-display.service';
import {UnitConversionService} from '../../shared/services/unit-conversion.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';

import { CircleBindingService } from '../circle-binding.service';

import {Event} from '../../shared/models/event';

// 1. QUESTION: should js-base64 be added to package.json?
// 2. TODO: If jwt times out (currently set for 10 days), give an error message
//    ("session timed out") and redirect to login page or something.  Currently it just
//    crashes...!!
// 3. Create a User object; if the user's token is still valid, but the user
//    refreshed the page or something, go fetch their info from the db and refresh
//    the user's login name in the nav bar, etc.


declare var $: any; // for using jQuery within this angular component

@Component({
  selector: 'app-analysis-display',
  templateUrl: 'analysis-display.component.html',
  styleUrls: ['analysis-display.component.scss']
})
export class AnalysisDisplayComponent implements OnInit, OnDestroy {

  // TODO: Should make circles and dots objects with methods; then they can 'do' things
  // to themselves, like set hovering, selecting dots, etc.;
  // could refactor this on the next go-around....

  //@Input() event: Event;
  //@Input() numberEventsRequested: any;

  userIsReadOnly: boolean = false; // set to true if viewing from the admin (for grading purposes)

  modalSaveWarningActions = new EventEmitter<string|MaterializeAction>();
  modalBrowseEventsActions = new EventEmitter<string|MaterializeAction>();
  modalCircleActions = new EventEmitter<string|MaterializeAction>();

  subscription: Subscription;
  circleSubscription: Subscription;
  tokenExpiredSubscription: Subscription;

  event: Event;
  private eventJSON: any;
  //private eventType: any;
  private eventTypeJSON: any;
  private circleChange = 1;//changed when a circle is changed...to wake up one or more components....
  private svgRegion: any;

  dots: any;
  circles = [];
  private numberCircles = 0;
  boundaries: any;
  momentumDiagramBoundaries: any;
  private interactionRegion: any;
  private interactionLocation: any;
  eventDisplay: any;

  editModeOn = false;
  private revealEvent = false;
  colourModeOn: boolean = false;
  showAxes = false;

  userEvents: any = [];

  private bFieldStrength = 80;//apparently this is approximately the B field generated by the dipole magnets at the LHC
  private bFieldDirection = 'in';

  modalSaveWarningParams = [
    {
      dismissible: false,
      alignment: 'right',
      complete: function() { console.log('Closed'); }
    }
  ]

  modalBrowseEventsParams = [
    {
      dismissible: false,
      alignment: 'right',
      complete: function() { console.log('Closed'); }
    }
  ]

  constructor(
    private unitConversionService:UnitConversionService,
    private eventAnalysisService:EventAnalysisService,
    private circleBindingService:CircleBindingService,
    private eventDisplayService:EventDisplayService) {
    this.subscription = eventDisplayService.gridActivationAnnounced$.subscribe(
      gridIndices => {
        this.activateDots(gridIndices);
      });
    this.circleSubscription = circleBindingService.circleUpdated$.subscribe(
      updateData=> {
        this.editCircleProperty(updateData);
        this.updateCircleTangentAngles();
        this.circleChange = -this.circleChange;
      });
    this.tokenExpiredSubscription = eventAnalysisService.tokenExpired$.subscribe(
      (data) => {
        console.log('token timed out!');
        this.closeBrowseEventsModal();
      });
  }

  ngOnInit() {
    this.unitConversionService.getGrid().subscribe(
      dots => {
        this.dots = dots;
      },
      err => console.log("ERROR", err),
      () => console.log("Grid fetched"));
    this.unitConversionService.getBoundaries().subscribe(
      boundaries => {
        this.boundaries = boundaries.boundaries;
        this.momentumDiagramBoundaries = boundaries.momentumDiagramBoundaries;
      },
      err => console.log("ERROR", err),
      () => console.log("Boundaries fetched"));
    this.unitConversionService.getInteractionRegion().subscribe(
      interactionRegion => {
        this.interactionRegion = interactionRegion;
      });
    this.getEvents();
  }

  fetchNewEvent() {
    this.turnOffEditMode();
    this.resetAxes();
    this.event = null;//forces a redraw of the event when the new one comes in
    this.eventDisplayService.getEvent()
      .subscribe(
        event => {
          this.eventJSON = event;
          //console.log(JSON.parse(this.eventJSON));
          //console.log(JSON.parse(this.event));
          this.event = JSON.parse(this.eventJSON);
          //console.log(this.event);
          this.resetCircles();
          this.initializeEvent();
        }
      );
  }

  /*
  fetchEventTypes() {
    //this.eventType = null;
    this.eventDisplayService.getEventTypes()
      .subscribe(
        eventType => {
          this.eventTypeJSON = eventType;
          //console.log(JSON.parse(this.eventTypeJSON));
          //console.log(JSON.parse(this.event));
        }
      );
  }
  */

  saveEvent(fetchAfterSave: boolean) {
    //probably need to tweak this list, but OK for now....
    let eventData = {
      event: this.event,
      circles: this.circles,
      eventJSON: this.eventJSON,
      eventType: this.eventTypeJSON,
      svgRegion: this.svgRegion,
      dots: this.dots,
      boundaries: this.boundaries,
      momentumDiagramBoundaries: this.momentumDiagramBoundaries,
      interactionRegion: this.interactionRegion,
      interactionLocation: this.interactionLocation,
      eventDisplay: this.eventDisplay,
      bFieldStrength: this.bFieldStrength,
      bFieldDirection: this.bFieldDirection
    };
    let filename = this.event.human_readable_name;
    this.eventAnalysisService.saveAnalyzedEvent(filename, eventData)
      .subscribe(
        savedEvent => {
          //console.log(savedEvent);
          this.getEvents();// update list of all events owned by user
          //console.log(JSON.parse(savedEvent));
          if (fetchAfterSave) {
            this.fetchNewEvent();
          }
        }
      );
  }

  getEvents() {
    var date;
    var options = {
      year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    this.eventAnalysisService.getAnalyzedEvents()
      .subscribe(
        userEvents => {
          //console.log(userEvents);
          this.userEvents = JSON.parse(userEvents);
          for (var i in this.userEvents) {
            date = new Date(this.userEvents[i].created);
            //console.log(date);
            this.userEvents[i].created = date.toLocaleTimeString("en-us", options);// makes the date a bit more human-readable
          }
        }
      );
  }

  listEvents(){
    console.log(this.userEvents);
  }



  initializeEvent() {
    this.interactionLocation = {
      x: Math.random() * (this.interactionRegion.xmax - this.interactionRegion.xmin) + this.interactionRegion.xmin,
      y: Math.random() * (this.interactionRegion.ymax - this.interactionRegion.ymin) + this.interactionRegion.ymin
    }

    //console.log('interaction location!');
    //console.log(this.interactionLocation);

    this.eventDisplay = this.eventDisplayService.getStringEventDisplay(
      this.bFieldStrength,
      this.bFieldDirection,
      this.dots,
      this.boundaries,
      this.interactionLocation,
      this.event);

    //console.log(this.eventDisplay);
  }

  /*
    this method is called after an array of activatedDots is received
    via the subscription service (following the generation of a new event)
   */
  activateDots(gridIndices) {
    if (this.dots !== undefined) {// in principle possible(?) that dots has not yet been initialized....
      for (let i in this.dots) {
        this.dots[i].activated = false; // first deactivate all dots
        this.dots[i].useForFit = false; // reset this property as well....
      }
      for (let i of gridIndices) { // now activate the ones indicated in gridIndices
        this.dots[i].activated = true;
      }
    }
  }

  resetCircles(){
    this.circles = [];
  }

  resetAxes(){
    this.showAxes = false;
  }

  clearDotsForFit(){
    var i;
    for (i=0; i<this.dots.length; i++) {
      this.dots[i].useForFit = false;
    }
    //this.eventAnalysisService.clearDotsForFit(this.dots);
  }

  selectDot(id: any){
    //console.log('inside selectDot');
    //console.log(id);
    var index = null;
    for (let i in this.dots){
      if ((this.dots[i].id === id) && (this.dots[i].activated)){
        index = i;//use this dot for the fit
      }
    }
    if (index !== null) {
      this.dots[index].useForFit = true;
    }
  }

  selectDotByIndex(index: number){
    this.dots[index].useForFit = true;
  }

  deselectDot(id: any){
    //console.log('inside deselectDot');
    //console.log(id);
    var index = null;
    for (let i in this.dots){
      if ((this.dots[i].id === id) && (this.dots[i].activated)){
        index = i;//use this dot for the fit
      }
    }
    if (index !== null) {
      this.dots[index].useForFit = false;
    }
  }

  deselectDotByIndex(index: number){
    this.dots[index].useForFit = false;
  }

  dotSelected(params: any) {
    //console.log('parent sensed mouse event!');
    //console.log(params);
    this.selectDot(params.id)
  }

  dotDeselected(params: any) {
    //console.log('parent sensed mouse event!');
    //console.log(params);
    this.deselectDot(params.id)
  }

  addCircle(){
    /*
     dataDict = {
     circle:      circleDataPx,
     error:        error,
     errorMessage: errorMessage
     };
     */
    var dataDict = this.eventAnalysisService.fitCircleToData(this.dots, this.boundaries);
    //var circleInputData = this.eventAnalysisService.gatherDataFromDots(this.dots);
    if (dataDict.error) {
      this.openCircleErrorModal();
    }
    if (!dataDict.error){
      this.circles.push(dataDict.circle);
      this.clearDotsForFit();
      this.numberCircles = this.circles.length;
      //console.log(this.numberCircles);
      if (this.numberCircles >= 2) {
        this.showAxes = true;
        this.updateCircleTangentAngles();
        this.circleChange = -this.circleChange;
      }
    }

  }

  // ACTUALLY: should define some actions that can occur for the circle:
  // 'hover', 'unhover', 'delete', 'toggleRotationDirection', 'toggleIncomingOutgoing'


  /*

   format for circle objects:

   circleDataPx = {
   xcPx: center.x,
   ycPx: center.y,
   rPx:  r,
   xc:   circleDatacm.xc,
   yc:   circleDatacm.yc,
   r:    circleDatacm.r,
   CW:   true,
   incoming: true,
   hovered: false,
   dotIndices: dotIndices,
   theta: null// eventually the (approx.) angle (in radians) of the momentum vector
   };

   format for grid (or 'dot') objects:

   grid:
   {
   id:     index,
   activated: false,
   x:         coordsPx.x,
   y:         coordsPx.y,
   xcm:       x,
   ycm:       y,
   useForFit: false,
   }

   */


  hoverCircle(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].hovered = true;
      this.clearDotsForFit();
      for (let dotIndex of this.circles[i].dotIndices){
        this.selectDotByIndex(dotIndex);
      }
    }
  }

  unhoverCircle(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].hovered = false;
      this.clearDotsForFit();
    }
  }

  deleteCircle(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles.splice(i,1);
      this.numberCircles = this.circles.length;
      this.clearDotsForFit();
      //console.log(this.numberCircles);
      if (this.numberCircles < 2) {
        this.showAxes = false;
        this.updateCircleTangentAngles();
        this.circleChange = -this.circleChange;
      }
    }
  }

  toggleCircleRotationDirection(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].CW = !this.circles[i].CW;
    }
  }

  updateCircleTangentAngles() {
    if (!this.showAxes) {
      for (let i in this.circles) {
        this.circles[i].theta = null;
      }
    } else {
      for (let i in this.circles) {
        var theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, this.circles[i]);
        this.circles[i].theta = theta;
      }
    }
  }

  /*
  addCircleTangentAngles() {
    for (let i in this.circles) {
      var theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, this.circles[i]);
      this.circles[i].theta = theta;
    }
  }
  */

  toggleParticleIncomingOutgoing(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].incoming = !this.circles[i].incoming;
    }
  }

  editCircleProperty(updateData) {

    //console.log('inside component');
    //console.log(updateData);

    var i = updateData.index;
    var command = updateData.command;
    if (this.circles[i] !== undefined) {
      switch (command) {
        case "hover":
          this.hoverCircle(i);
          break;
        case "unhover":
          this.unhoverCircle(i);
          break;
        case "delete":
          this.deleteCircle(i);
          break;
        case "toggleRotationDirection":
          this.toggleCircleRotationDirection(i);
          break;
        case "toggleIncomingOutgoing":
          this.toggleParticleIncomingOutgoing(i);
          break;
      }
    }
  }

  turnOnEditMode(){
    //console.log('inside toggle edit mode fn');
    if (!this.editModeOn) {
      this.editModeOn = true;
      this.colourModeOn = true;
    }
  }

  turnOffEditMode(){
    this.editModeOn = false;
  }

  showEvent(){
    this.revealEvent = true;
  }

  hideEvent(){
    this.revealEvent = false;
  }

  // the following can be used to close a modal programmatically....
  // (see Galilee webapp -- update resource collection)
  onModalFinished(eventID: string){
    // Note: must include the following declaration (above) in component:
    //          declare var $: any;
    this.closeBrowseEventsModal();
    this.getAnalyzedEvent(eventID);
  }

  getAnalyzedEvent(id) {
    var eventNewData;
    // get the analyzed event from the database
    //console.log('about to get event #....');
    //console.log(id);

    this.eventAnalysisService.getAnalyzedEvent(id).subscribe(
      eventData => {
        //console.log(eventData);
        eventNewData = JSON.parse(eventData.event_data);
        this.refreshView(eventNewData);
      },
      err => console.log("ERROR", err),
      () => console.log("event fetched"));

  }

  refreshView(eventData) {
    //console.log(eventData);
    this.event = eventData.event;
    this.eventTypeJSON = eventData.eventType;
    this.svgRegion = eventData.svgRegion;
    this.eventJSON = eventData.eventJSON;
    this.circleChange = - this.circleChange;
    this.dots = eventData.dots;
    this.circles = eventData.circles;
    this.clearDotsForFit();

    this.numberCircles = this.circles.length;

    this.boundaries = eventData.boundaries;
    this.momentumDiagramBoundaries = eventData.momentumDiagramBoundaries;
    this.interactionRegion = eventData.interactionRegion;
    this.interactionLocation = eventData.interactionLocation;

    this.eventDisplay = eventData.eventDisplay;

    this.editModeOn = true;
    this.revealEvent = false;
    this.colourModeOn = true;

    this.bFieldStrength = eventData.bFieldStrength;
    this.bFieldDirection = eventData.bFieldDirection;

    if (this.numberCircles >= 2) {
      this.showAxes = true;
      this.updateCircleTangentAngles();
      this.circleChange = -this.circleChange;
    } else {
      this.showAxes = false;
    }


  }


  toggleColourMode(){
    console.log('colour mode toggled!');
    this.colourModeOn =!this.colourModeOn;
    console.log('colour mode is on? ', this.colourModeOn);
  }

  openSaveWarningModal() {
    this.modalSaveWarningActions.emit({action:"modal",params:['open']});
  }

  closeSaveWarningModal() {
    this.modalSaveWarningActions.emit({action:"modal",params:['close']});
  }

  openBrowseEventsModal() {
    this.getEvents();
    this.modalBrowseEventsActions.emit({action:"modal",params:['open']});
  }

  closeBrowseEventsModal() {
    this.modalBrowseEventsActions.emit({action:"modal",params:['close']});
  }

  openCircleErrorModal() {
    this.modalCircleActions.emit({action:"modal",params:['open']});
  }

  closeAnalysisDisplay() {
    this.eventAnalysisService.announcedAnalysisDisplayClosed();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.circleSubscription.unsubscribe();
    this.tokenExpiredSubscription.unsubscribe();
  }

}
