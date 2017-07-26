import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WiadsLoadingPage } from './wiads-loading';

@NgModule({
  declarations: [
    WiadsLoadingPage,
  ],
  imports: [
    IonicPageModule.forChild(WiadsLoadingPage),
  ],
  exports: [
    WiadsLoadingPage
  ]
})
export class WiadsLoadingPageModule {}
