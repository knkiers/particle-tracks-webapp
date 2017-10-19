import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import {UserService} from '../../shared/services/user.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';
import {User} from '../../shared/models/user';

import { UserEventAnchorDirective } from './user-event-anchor.directive';
import {AnalysisDisplayComponent} from '../../end-user/analysis-display';
import { EventInfoAnchorDirective } from './event-info-anchor.directive';
import {EventEnergyMomentumComponent} from '../event-energy-momentum/event-energy-momentum.component';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.css']
})
export class UserEventsComponent implements OnInit, OnDestroy {

  @ViewChild(UserEventAnchorDirective) userEventAnchor: UserEventAnchorDirective;
  @ViewChild(EventInfoAnchorDirective) eventInfoAnchor: EventInfoAnchorDirective;

  private user: User = null;
  events: any = null;
  private analysisDisplayComponent: any;
  private eventEnergyMomentumComponent: any;

  subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private eventAnalysisService: EventAnalysisService,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.subscription = eventAnalysisService.analysisDisplayClosed$.subscribe(
      event => {
        this.closeUserEvent();
      });
  }

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

  openUserEvent(eventData: any) {
    console.log(eventData);
    this.userEventAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AnalysisDisplayComponent);
    this.analysisDisplayComponent = this.userEventAnchor.viewContainer.createComponent(componentFactory).instance;
    this.analysisDisplayComponent.refreshView(eventData);
    this.analysisDisplayComponent.userIsReadOnly = true;

    this.eventInfoAnchor.viewContainer.clear();
    let eventInfoComponentFactory = this.componentFactoryResolver.resolveComponentFactory(EventEnergyMomentumComponent);
    this.eventEnergyMomentumComponent = this.eventInfoAnchor.viewContainer.createComponent(eventInfoComponentFactory).instance;
    this.eventEnergyMomentumComponent.eventData = eventData;
    //this.analysisDisplayComponent.userIsReadOnly = true;

  }

  closeUserEvent() {
    this.userEventAnchor.viewContainer.clear();
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
