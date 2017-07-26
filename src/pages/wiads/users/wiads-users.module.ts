import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WiadsUsersPage } from './wiads-users';

@NgModule({
  declarations: [
    WiadsUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(WiadsUsersPage),
  ],
  exports: [
    WiadsUsersPage
  ]
})
export class WiadsUsersPageModule {}
