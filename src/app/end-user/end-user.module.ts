import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {MaterializeModule} from "angular2-materialize";

import {SharedModule} from '../shared/shared.module';

import { AnalyzeEventComponent } from './analyze-event';
import {EndUserComponent} from './end-user.component';
import {AnalysisDisplayComponent} from './analysis-display';
import {AxisComponent} from './axis';
import {CircleItemComponent} from './circle-item';
import {CircleTableComponent} from './circle-table';
import {EventComponent} from './event';
import {EventItemComponent} from './event-item';
import {GridItemComponent} from './grid-item';
import {ListSavedEventsComponent} from './list-saved-events';
import {MomentumAxisComponent} from './momentum-axis';

import {RoundRealPipe} from '../shared/pipes/round-real.pipe';


import { LoggedInGuard } from '../shared/guards/logged-in.guard';



const routes: Routes = [
  {
    path: 'end-user',
    component: EndUserComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: AnalyzeEventComponent,
      },

      ]
  },
];



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterializeModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    EndUserComponent,
    AnalyzeEventComponent,
    AnalysisDisplayComponent,
    AxisComponent,
    CircleItemComponent,
    CircleTableComponent,
    EventComponent,
    EventItemComponent,
    GridItemComponent,
    ListSavedEventsComponent,
    MomentumAxisComponent,
    RoundRealPipe
  ]
})
export class EndUserModule { }
