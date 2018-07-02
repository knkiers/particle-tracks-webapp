import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule, Routes} from "@angular/router";

import {MaterializeModule} from "angular2-materialize";

import {StaticContentComponent} from './static-content.component';

import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: StaticContentComponent,
    //canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },

    ]
  },
];



@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    StaticContentComponent,
    WelcomeComponent
  ]
})
export class StaticContentModule { }
