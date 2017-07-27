import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppController } from '../providers/app-controller';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = "HomePage";

  constructor(private menuController: MenuController, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      splashScreen.hide();
      AppController.getInstance().setPlatform(platform);
    });
  }

}
