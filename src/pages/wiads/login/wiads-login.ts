import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, Loading, LoadingController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { WiadsModule } from '../../../providers/wiads/wiads';
import { WiadsAccessToken } from '../../../providers/wiads/classes/access-token';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-wiads-login',
  templateUrl: 'wiads-login.html',
})
export class WiadsLoginPage {

  mInputs = {
    username: "wiads",
    password: "wiads@admin@wiads"
  };

  constructor(
    private navCtrl: NavController,
    private mWiadsModule: WiadsModule,
    private mToastController: ToastController,
    private mLoadingController: LoadingController,
    private mStorage: Storage,
    private mStatusBar: StatusBar,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.onPlatformReady();
    })
  }

  ionViewDidEnter() {
    this.doCheckAccessToken();
    //  this.onLoggedIn();
  }
  doCheckAccessToken() {
    let data = this.mStorage.get("wiadsaccesstoken").then(
      data => {
        this.onExistAccesstoken(data);
      },
      error => {
        this.onNotExistAccesstoken();
      }
    );
  }
  doSaveToken() {
    this.mStorage.set("wiadsaccesstoken", this.mWiadsModule.getHttpService().getAccesstoken().getTokenData());
  }
  onExistAccesstoken(data) {
    if (this.mWiadsModule.getHttpService().getAccesstoken().isValidTokenData(data)) {
      console.log("token", data);
      this.mWiadsModule.getHttpService().getAccesstoken().onValidTokenData(data);
      this.onLoggedIn();
    } else {
      this.onNotExistAccesstoken();
    }
  }
  onNotExistAccesstoken(error?: any) {

  }

  onClickLogin() {
    this.requestAccessToken();
  }
  onPlatformReady() {
    this.mStatusBar.backgroundColorByHexString("#d94d00");
    this.mStatusBar.overlaysWebView(false);
  }
  private isInvalidInputs() {
    return this.mInputs.username.length == 0 || this.mInputs.password.length == 0;
  }
  private requestAccessToken() {

    if (this.isInvalidInputs()) {
      this.doShowToast("Vui lòng nhập đầy đủ thông tin", 2000, "top");
      return;
    }
    this.showLoading();
    this.mWiadsModule.getHttpService().requestLogin(this.mInputs.username, this.mInputs.password).then(
      data => {
        this.closeLoading();
        this.onResponseLogin(data);
      }
    ).catch(
      () => {
        this.doShowToast("Có lỗi xảy ra, vui lòng thử lại", 2000, "top");
        this.closeLoading();
      });
  }
  onResponseLogin(data) {
    console.log("data", data);
    this.mWiadsModule.getHttpService().onResponseAccessToken(data);
    if (this.mWiadsModule.getHttpService().hasToken()) {
      this.doSaveToken();
      this.onLoggedIn();
    } else {
      this.doShowToast("Có lỗi xảy ra, vui lòng thử lại", 2000, "top");
    }
  }
  onLoggedIn() {
    this.navCtrl.setRoot("WiadsLoadingPage");
  }

  doShowToast(message: string, duration: number, position: string) {
    let toast = this.mToastController.create(
      {
        message: message,
        position: position,
        duration: duration
      }
    );
    toast.present();
  }

  mLoading: Loading;
  showLoading() {
    if (this.mLoading == null || this.mLoading == undefined) {
      this.mLoading = this.mLoadingController.create({
        content: "Vui lòng đợi",
        spinner: "ios",
        duration: 6000
      });
      this.mLoading.onDidDismiss(() => {
        this.mLoading = null;
      });
      this.mLoading.present().then();
    }
  }
  closeLoading() {
    if (this.mLoading) {
      this.mLoading.dismiss();
    } else {
      this.mLoading = null;
    }
  }

}
