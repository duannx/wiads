import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WiadsLoginPage } from './wiads-login';

@NgModule({
  declarations: [
    WiadsLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(WiadsLoginPage),
  ],
  exports: [
    WiadsLoginPage
  ]
})
export class WiadsLoginPageModule { }
