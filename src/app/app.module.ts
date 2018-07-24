import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http, RequestOptions} from '@angular/http';

// see: https://blog.hackages.io/angular-http-httpclient-same-but-different-86a50bbcc450
import { HttpClientModule } from '@angular/common/http';

import {RouterModule, Routes} from "@angular/router";

import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';

import {AuthenticationModule} from './authentication/authentication.module';
import {EndUserModule} from './end-user/end-user.module';
import {AdminModule} from './admin/admin.module';
import {StaticContentModule} from './static-content/static-content.module';

import { LoggedInGuard } from './shared/guards/logged-in.guard';
import { NotLoggedInGuard } from './shared/guards/not-logged-in.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { UserService } from './shared/services/user.service';


const routes: Routes = [
  //{path: '', redirectTo: '/login', pathMatch: 'full'}
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
    StaticContentModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [FormBuilder, LoggedInGuard, NotLoggedInGuard, AdminGuard, UserService],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
