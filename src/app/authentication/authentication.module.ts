import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterializeModule} from "angular2-materialize";

import {SharedModule} from '../shared/shared.module';

import { NotLoggedInGuard } from '../shared/guards/not-logged-in.guard';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedInGuard],
  },
  {path: 'signup', component: SignupComponent}
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterializeModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class AuthenticationModule { }
