import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {MaterializeModule} from "angular2-materialize";

import {SharedModule} from '../shared/shared.module';

import {AdminComponent} from './admin.component';
// import { AnalyzeEventComponent } from './analyze-event';
// import {EndUserComponent} from './end-user.component';
// import {AnalysisDisplayComponent} from './analysis-display';
// import {AxisComponent} from './axis';
// import {CircleItemComponent} from './circle-item';
// import {CircleTableComponent} from './circle-table';
// import {EventComponent} from './event';
// import {EventItemComponent} from './event-item';
// import {GridItemComponent} from './grid-item';
// import {ListSavedEventsComponent} from './list-saved-events';
// import {MomentumAxisComponent} from './momentum-axis';

//import {RoundRealPipe} from '../shared/pipes/round-real.pipe';


import { LoggedInGuard } from '../shared/guards/logged-in.guard';
import { AdminGuard } from '../shared/guards/admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserEventsComponent } from './user-events/user-events.component';
import { UserEventAnchorDirective } from './user-events/user-event-anchor.directive';
import {AnalysisDisplayComponent} from '../end-user/analysis-display';
import { EventEnergyMomentumComponent } from './event-energy-momentum/event-energy-momentum.component';
import { EventInfoAnchorDirective } from './user-events/event-info-anchor.directive';
import { TeacherResourcesComponent } from './static-content/teacher-resources/teacher-resources.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [LoggedInGuard, AdminGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'user-events/:userId',
        component: UserEventsComponent,
      },
    ]
  },
  {
    path: 'teacher-resources',
    component: TeacherResourcesComponent,
    canActivate: [LoggedInGuard, AdminGuard],
  }
];



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterializeModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    AnalysisDisplayComponent,
    EventEnergyMomentumComponent
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    UserEventsComponent,
    UserEventAnchorDirective,
    EventEnergyMomentumComponent,
    EventInfoAnchorDirective,
    TeacherResourcesComponent
  ]
})
export class AdminModule { }
