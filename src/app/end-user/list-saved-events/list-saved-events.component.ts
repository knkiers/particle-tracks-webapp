import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import {EventAnalysisService} from '../../shared/services/event-analysis.service';


@Component({
  selector: 'app-list-saved-events',
  templateUrl: 'list-saved-events.component.html',
  styleUrls: ['list-saved-events.component.css']
})
export class ListSavedEventsComponent implements OnInit {

  @Input() eventList: any;
  @Input() modalID: string;
  @Output() onFinished = new EventEmitter<string>();

  constructor(private eventAnalysisService:EventAnalysisService) {}

  //date: Date;
  ngOnInit() {
    console.log(this.eventList);
    /*for (var event of this.eventList) {
      console.log(event.created);
      //this.date = new Date(event.created);
      console.log(this.date);
    }
    */


  }

  submitAnalyzedEvent(id, submit:boolean){
    // unsubmits event if submit is set to false
    var eventNewData;
    var title;
    var date;
    var options = {
      year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    console.log(id);
    console.log('submitting event');
    this.eventAnalysisService.submitAnalyzedEvent(id, submit).subscribe(
      eventData => {
        console.log('back from submitting');
        console.log(eventData);
        // now need to refresh the event list....
        this.eventAnalysisService.getAnalyzedEvents()
          .subscribe(
            userEvents => {
              this.eventList = JSON.parse(userEvents);
              console.log(this.eventList);
              for (var i in this.eventList) {
                date = new Date(this.eventList[i].created);
                //console.log(date);
                this.eventList[i].created = date.toLocaleTimeString("en-us", options);// makes the date a bit more human-readable
              }
            }
          );
      },
      err => console.log("ERROR", err),
      () => console.log("event fetched"));
  }

  closeModalFetchEvent(eventID) {
    /*
     This emits an event that the parent component listens for; then the parent uses
     the modalID to close the modal.
     Note: The parent component must declare the following in order to close
     the modal programmatically:
     declare var $: any;
     */
    console.log('about to emit the close signal');
    this.onFinished.emit(eventID);
  }



}
