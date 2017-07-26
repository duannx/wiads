import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WiadsAdsvertisementPage } from './wiads-adsvertisement';

@NgModule({
  declarations: [
    WiadsAdsvertisementPage,
  ],
  imports: [
    IonicPageModule.forChild(WiadsAdsvertisementPage),
  ],
  exports: [
    WiadsAdsvertisementPage
  ]
})
export class WiadsAdsvertisementPageModule {}
