import { Component, OnInit } from '@angular/core';

import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: any = []; //TODO: create a User object....

  constructor(
    private userService: UserService
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

}
