import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule, Routes} from "@angular/router";

import {MaterializeModule} from "angular2-materialize";
//import {MaterializeDirective,MaterializeAction} from "angular2-materialize";

import {SharedModule} from '../shared/shared.module';

//import {NeutralDecaysComponent} from '../shared/static-content/neutral-decays/neutral-decays.component';
//import {ChargedDecaysComponent} from '../shared/static-content/charged-decays/charged-decays.component';

import {StaticContentComponent} from './static-content.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { ForTeachersComponent } from './for-teachers/for-teachers.component';
import { BackgroundComponent } from './background/background.component';
import { DemoComponent } from './demo/demo.component';
import { ExampleProblemsComponent } from './example-problems/example-problems.component';
import { AdvancedBackgroundComponent } from './advanced-background/advanced-background.component';

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
      {
        path: 'advanced-background',
        component: AdvancedBackgroundComponent,
      },

    ]
  },
];



@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    StaticContentComponent,
    WelcomeComponent,
    ForTeachersComponent,
    BackgroundComponent,
    DemoComponent,
    ExampleProblemsComponent,
    AdvancedBackgroundComponent
  ]
})
export class StaticContentModule { }
