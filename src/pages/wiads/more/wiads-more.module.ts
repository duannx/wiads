import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WiadsMorePage } from './wiads-more';

@NgModule({
  declarations: [
    WiadsMorePage,
  ],
  imports: [
    IonicPageModule.forChild(WiadsMorePage),
  ],
  exports: [
    WiadsMorePage
  ]
})
export class WiadsMorePagePageModule {}
