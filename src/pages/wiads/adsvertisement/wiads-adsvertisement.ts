import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { WiadsModule } from '../../../providers/wiads/wiads'; 
@IonicPage()
@Component({
  selector: 'page-wiads-advertisement',
  templateUrl: 'wiads-adsvertisement.html',
})
export class WiadsAdsvertisementPage {

  constructor(
    private navCtrl: NavController,
    private mWiadsModule: WiadsModule,
    private mToastController: ToastController, 
  ) { }


  ionViewDidEnter() { 
  }
 
}
