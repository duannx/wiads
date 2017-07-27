import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams } from 'ionic-angular';
import { WiadsModule } from '../../../providers/wiads/wiads';
import { WiadsTabsPage } from '../tabs/wiads-tabs';
import { AppLoop } from '../../../providers/app-loop';

@IonicPage()
@Component({
  selector: 'page-wiads-loading',
  templateUrl: 'wiads-loading.html',
})
export class WiadsLoadingPage {
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private mWiadsModule: WiadsModule,
  ) {

  }

  ionViewDidEnter() {
    AppLoop.getInstance().start();
    AppLoop.getInstance().unScheduleUpdateAll();
    AppLoop.getInstance().scheduleUpdate(this.mWiadsModule);
    this.mWiadsModule.onLoading();
    setTimeout(()=>{
      this.onLoaded();
    },1000);
  }

  onLoaded() {
    this.navCtrl.setRoot(WiadsTabsPage);
  }
}
