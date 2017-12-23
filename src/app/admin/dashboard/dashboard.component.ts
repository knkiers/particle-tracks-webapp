import { Component, OnInit } from '@angular/core';

import {UserService} from '../../shared/services/user.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  institutions: any = null;
  haveInstitutions: boolean = false;
  users: any = []; //TODO: create a User object....

  constructor(
    private userService: UserService,
    private eventAnalysisService: EventAnalysisService
  ) { }

  ngOnInit() {
    this.fetchInstitutions();
    this.userService.fetchUsersThisInstitution().subscribe(
      users => {
        console.log('got users!');
        this.users = JSON.parse(users);
      }
    )

  }

  fetchInstitutions() {
    this.userService.fetchInstitutions().subscribe(
      institutions => {
        console.log('institutions: ',institutions);
        this.institutions = institutions;
        this.haveInstitutions = true;
      },
      err => console.log("ERROR", err)
    );

  }

  getInstitutionName(id: number) {
    let institutionName = null;
    for (let institution of this.institutions) {
      if (institution.id === id) {
        institutionName = institution.name;
      }
    }
    return institutionName;
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
