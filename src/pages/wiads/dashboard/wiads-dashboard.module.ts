import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {  WiadsDashboardPage } from './wiads-dashboard';

@NgModule({
  declarations: [
    WiadsDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(WiadsDashboardPage),
  ],
  exports: [
    WiadsDashboardPage
  ]
})
export class WiadsDashboardPageModule { }
