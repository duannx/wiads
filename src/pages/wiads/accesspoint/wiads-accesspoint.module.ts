import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WiadsAccesspointPage } from './wiads-accesspoint';

@NgModule({
  declarations: [
    WiadsAccesspointPage,
  ],
  imports: [
    IonicPageModule.forChild(WiadsAccesspointPage),
  ],
  exports: [
    WiadsAccesspointPage
  ]
})
export class WiadsAccesspointPageModule {}
