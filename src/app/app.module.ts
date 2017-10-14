import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http, RequestOptions} from '@angular/http';
import {RouterModule, Routes} from "@angular/router";

import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';

import {AuthenticationModule} from './authentication/authentication.module';
import {EndUserModule} from './end-user/end-user.module';
import {AdminModule} from './admin/admin.module';

import { LoggedInGuard } from './shared/guards/logged-in.guard';
import { UserService } from './shared/services/user.service';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'}
  ];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {enableTracing: true}),
    MaterializeModule,
    AuthenticationModule,
    EndUserModule,
    AdminModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [FormBuilder, LoggedInGuard, UserService],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
