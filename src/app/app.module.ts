import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http, RequestOptions} from '@angular/http';
import {RouterModule, Routes} from "@angular/router";

import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';

import {AuthenticationModule} from './authentication/authentication.module';

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
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [FormBuilder],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
