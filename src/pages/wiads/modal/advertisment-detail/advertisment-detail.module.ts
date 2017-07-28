import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvertismentDetailPage } from './advertisment-detail';

@NgModule({
  declarations: [
    AdvertismentDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AdvertismentDetailPage),
  ],
  exports: [
    AdvertismentDetailPage
  ]
})
export class AdvertismentDetailPageModule { }
