import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {UserService} from '../../shared/services/user.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';
import {User} from '../../shared/models/user';


@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.css']
})
export class UserEventsComponent implements OnInit {

  private user: User = null;
  events: any = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private eventAnalysisService: EventAnalysisService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('user-events -- received route params!');
      let userId = +params['userId'];
      this.fetchUser(userId);
    });
  }

  fetchUser(userId: number) {
    this.userService.fetchUser(userId).subscribe(
      user => {
        console.log('got user data!');
        this.user = new User(user);
        console.log(this.user);
        this.fetchUserEvents(this.user.analyzedEvents);
      });
  }

  fetchUserEvents(eventIdList: number[]) {
    let options = {
      year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };

    console.log('here are the events: ', eventIdList);
    this.eventAnalysisService.getAnalyzedUserEvents(eventIdList).subscribe(
      userEvents => {
        let events = userEvents;//JSON.parse(userEvents);
        /*
        for (var i in events) {
          let date = new Date(this.events[i].created);
          //console.log(date);
          this.events.created = date.toLocaleTimeString("en-us", options);// makes the date a bit more human-readable
        }
        */
        console.log(events);
        let submittedEvents = [];
        let nonsubmittedEvents  =[];
        events.forEach(event => {
          let date = new Date(event.created);
          let newEvent = event;
          newEvent.event_data = JSON.parse(event.event_data);
          newEvent.created = date.toLocaleTimeString("en-us", options);// makes the date a bit more human-readable
          if (event.submitted) {
            submittedEvents.push(event);
          } else {
            nonsubmittedEvents.push(event);
          }
        });
        //https://www.w3schools.com/jsref/jsref_concat_array.asp
        this.events = submittedEvents.concat(nonsubmittedEvents);
        console.log(this.events);
      }
    );
  }





}
