import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterializeModule} from "angular2-materialize";

import {SharedModule} from '../shared/shared.module';

import { NotLoggedInGuard } from '../shared/guards/not-logged-in.guard';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';


import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedInGuard],
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    //canActivate: [NotLoggedInGuard],
  },
  {
    path: 'reset-password-confirm',
    component: ResetPasswordConfirmComponent,
    //canActivate: [NotLoggedInGuard],
  },
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
  declarations: [LoginComponent, SignupComponent, ProfileComponent, ResetPasswordComponent, ResetPasswordConfirmComponent]
})
export class AuthenticationModule { }
