import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { WamhostWCComponent } from './wamhost-wc/wamhost-wc.component';
import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UrlSegmentGroup, UrlSegment, UrlMatchResult } from '@angular/router';


export const routes: Routes = [
    
    {'path' : 'wamhost-wc/:path', component : WamhostWCComponent},
    {'path' : '', component : DisplayComponent},
    { 'path': '**', redirectTo: '/wamhost-wc' }];
