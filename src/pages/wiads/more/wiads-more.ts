import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { WiadsModule } from '../../../providers/wiads/wiads';

@IonicPage()
@Component({
  selector: 'page-wiads-more',
  templateUrl: 'wiads-more.html',
})
export class WiadsMorePage {


  constructor(
    private navCtrl: NavController,
    private mWiadsModule: WiadsModule,
    private mToastController: ToastController
  ) { }


}
