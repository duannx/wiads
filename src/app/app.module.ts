import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatePicker } from '@ionic-native/date-picker';

import { Device } from '@ionic-native/device';

import { GoogleMaps, Geocoder } from '@ionic-native/google-maps';

import { Keyboard } from '@ionic-native/keyboard';


import { HttpService } from '../providers/http-service';
import { WiadsModule } from '../providers/wiads/wiads';
import { DeviceInfoProvider } from '../providers/device-info/device-info';
import { WiadsTabsPage } from '../pages/wiads/tabs/wiads-tabs';

@NgModule({
  declarations: [
    MyApp,
    WiadsTabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: "true",
      platform: {
        ios: {
          statusbarPadding: false
        }
      },
      scrollAssist: false
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WiadsTabsPage
  ],
  providers: [
    Device,
    StatusBar,
    SplashScreen,
    DatePicker,
    GoogleMaps,
    Geocoder,
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpService,
    DeviceInfoProvider,
    WiadsModule
  ]
})
export class AppModule { }
