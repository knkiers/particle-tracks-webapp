import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule, Routes} from "@angular/router";

import {MaterializeModule} from "angular2-materialize";

import {StaticContentComponent} from './static-content.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { ForTeachersComponent } from './for-teachers/for-teachers.component';
import { BackgroundComponent } from './background/background.component';
import { DemoComponent } from './demo/demo.component';
import { ExampleProblemsComponent } from './example-problems/example-problems.component';

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
      {
        path: 'teacher-faq',
        component: ForTeachersComponent,
      },
      {
        path: 'example-problems',
        component: ExampleProblemsComponent,
      },
      {
        path: 'demo',
        component: DemoComponent,
      },
      {
        path: 'background',
        component: BackgroundComponent,
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
    WelcomeComponent,
    ForTeachersComponent,
    BackgroundComponent,
    DemoComponent,
    ExampleProblemsComponent
  ]
})
export class StaticContentModule { }
