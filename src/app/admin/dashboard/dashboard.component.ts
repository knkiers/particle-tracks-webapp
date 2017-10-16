import { Component, OnInit } from '@angular/core';

import {UserService} from '../../shared/services/user.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: any = []; //TODO: create a User object....

  constructor(
    private userService: UserService,
    private eventAnalysisService: EventAnalysisService
  ) { }

  ngOnInit() {
    this.userService.fetchUsers().subscribe(
      users => {
        console.log('got users!');
        console.log(users);
        this.users = users;
      }
    )

  }

  fetchEvent(id: number) {
    console.log('event id: ', id, typeof id);
    this.eventAnalysisService.getAnalyzedEvent(id).subscribe(
      result => {
        console.log(result);
      }
    )


  }

}
