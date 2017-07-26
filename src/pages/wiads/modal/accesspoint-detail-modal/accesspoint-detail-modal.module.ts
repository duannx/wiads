import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccesspointDetailModalPage } from './accesspoint-detail-modal';

@NgModule({
  declarations: [
    AccesspointDetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AccesspointDetailModalPage),
  ],
  exports: [
    AccesspointDetailModalPage
  ]
})
export class AccesspointDetailModalPageModule { }
