import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, Loading, ModalController, Content } from 'ionic-angular';
import { WiadsModule } from '../../../providers/wiads/wiads';
import { AccessPoint } from '../../../providers/wiads/classes/accesspoint';
import { Province } from '../../../providers/wiads/classes/province';
import { AccesspointBandwidth } from '../../../providers/wiads/classes/bandwidth';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Geocoder,
  GeocoderRequest,
  Marker
} from '@ionic-native/google-maps';


@IonicPage()
@Component({
  selector: 'page-wiads-accesspoint',
  templateUrl: 'wiads-accesspoint.html',
})
export class WiadsAccesspointPage {
  @ViewChild(Content) content: Content;

  VIEW_MAP: number = 1;
  VIEW_LIST: number = 2;

  mViewType: number = 2;
  mShowPopupDetail: boolean = false;

  loading: Loading;
  isShowingLoading = false;
  map: GoogleMap;
  provinces: Array<Province> = [];
  selectedProvince: Province;
  latLngMarker: Array<LatLng> = [];
  isEntered = false;

  bandwidths: Array<AccesspointBandwidth> = [];
  selectedBanwidth: AccesspointBandwidth = new AccesspointBandwidth();

  accesspoints: Array<AccessPoint> = [];
  selectedAccesspoint: AccessPoint;

  mDoLoadMore: boolean = false;
  constructor(
    private navCtrl: NavController,
    private mWiadsModule: WiadsModule,
    public alertCtrl: AlertController,
    private googleMaps: GoogleMaps,
    private loadingCtrl: LoadingController,
    private geocoder: Geocoder,
    private modalCtrl: ModalController
  ) {
    this.selectedAccesspoint = new AccessPoint();
    this.selectedProvince = new Province();
    //Accesspoints change
    this.mWiadsModule.getListBaseAccesspoint().setOnChangeListener((items) => {
      this.onListAccesspointChange(items);
    });

    this.mWiadsModule.getLocationBaseAccesspoint().setOnChangeListener((items, additionItems) => {
      this.onLocationAccespointChange(items, additionItems);
    })
  }

  onLocationAccespointChange(items, additionItems) {
    console.log("onLocation Accesspoint change");

    if (this.isViewMap()) {
      for (let item of additionItems) {
        let accesspoint = new AccessPoint();
        accesspoint.pair(item);
        if (accesspoint.mLat && accesspoint.mLng) {
          let latlng = new LatLng(accesspoint.mLat, accesspoint.mLng);
          if (this.latLngMarker.findIndex(elm => {
            return elm.equals(latlng);
          }) == -1) {
            console.log("add marker " + accesspoint.mName);

            this.map.addMarker({
              title: accesspoint.mName,
              snippet: accesspoint.mAddress,
              position: latlng,
            }).then(marker => {
              this.latLngMarker.push(latlng);
              marker.on("marker_click").subscribe((event) => {
                this.selectedAccesspoint.mName = accesspoint.mName;
                this.selectedAccesspoint.mAddress = accesspoint.mAddress;
                this.selectedAccesspoint.mLastTimeOnline = accesspoint.mLastTimeOnline;
                this.showAccesspointPopupDetail(true);
              })
            })
          }
        }
      }
      this.closeLoading();
    }
  }

  onListAccesspointChange(items) {
    if (this.isViewList() && !this.mDoLoadMore) {
      this.accesspoints = [];
      for (let item of items) {
        this.accesspoints.push(item);
      }
      this.closeLoading();
    }
  }

  isViewList() {
    return this.mViewType == this.VIEW_LIST;
  }
  isViewMap() {
    return this.mViewType == this.VIEW_MAP;
  }


  doInfinite(infiniteScroll) {
    this.mDoLoadMore = true;
    this.mWiadsModule.getListBaseAccesspoint().doLoadMore((items) => {
      for (let item of items) {
        let accesspoint = new AccessPoint();
        accesspoint.pair(item);
        this.accesspoints.push(item);
      }
      infiniteScroll.complete();
      this.mDoLoadMore = false;
    });

  }

  showLoading() {
    if (this.loading) this.loading.dismiss();
    this.loading = this.loadingCtrl.create({
      content: "Vui lòng đợi",
      duration: 3000,
      dismissOnPageChange: true
    })
    this.loading.present();
    this.loading.onDidDismiss(() => {
      this.isShowingLoading = false;
    })
    this.isShowingLoading = true;
  }

  closeLoading() {
    if (this.loading) this.loading.dismiss();
  }

  ionViewDidEnter() {
    if (!this.isEntered) {
      this.showLoading();


      this.content.ionScrollEnd.subscribe(() => {
        this.onScrollEnd();
      });

      this.mWiadsModule.getProvinces().then((data) => {
        this.onResponseProvince(data);
        this.onInputChange();
      }, error => {
      });

      this.mWiadsModule.getBandwidths().then((data) => {
        this.onResponseBanwidth(data);
      });
    }
    this.isEntered = true;
  }

  onScrollEnd() {
    if (!this.isViewList()) return;
    if (this.mDoLoadMore) return;
    this.mDoLoadMore = true;
    this.mWiadsModule.getListBaseAccesspoint().doLoadMore((items) => {
      for (let item of items) {
        let accesspoint = new AccessPoint();
        accesspoint.pair(item);
        this.accesspoints.push(item);
      }
      this.mDoLoadMore = false;
    });
  }

  onClickHeader() {
    this.content.scrollToTop();
  }

  onClickToggleView() {

    if (this.isViewList()) {

      this.createGoogleMap();

      this.mViewType = this.VIEW_MAP;

      if (this.map) this.map.setVisible(true);
      setTimeout(() => {
        if (this.isViewMap()) this.map.refreshLayout();
      }, 1000);

      this.content.getScrollElement().style.overflowY = "hidden";

    } else if (this.isViewMap()) {
      this.content.getScrollElement().style.overflowY = "auto";
      this.mViewType = this.VIEW_LIST;

      if (this.map) this.map.setVisible(false);
    }

    if (this.isViewList()) this.showAccesspointPopupDetail(false);

    this.onInputChange();
  }

  createGoogleMap() {
    if (this.map) return;

    let element: HTMLElement = document.getElementById('wiads-map');
    if (element) {

      let mapOptions: GoogleMapOptions = {
        mapType: 'MAP_TYPE_NORMAL',
        controls: {
          compass: false,
          myLocationButton: false,
          indoorPicker: false,
<<<<<<< HEAD
          mapToolbar: false
=======
>>>>>>> 82fcbfd19e3ecaa96e519d9f52701f4ec62856a3
          // zoom: false
        },
        gestures: {
          scroll: true,
          tilt: false,
          zoom: true,
          rotate: false,
        },
        styles: [
          {
            featureType: "transit.station.bus",
            stylers: [
              {
                "visibility": "off"
              }
            ]
          }
        ],
        camera: {
          target: new LatLng(21.027764, 105.834160),
          zoom: 10,
          tilt: 0
        },
        preferences: {
          zoom: {
            minZoom: 10,
            maxZoom: 20
          },
          building: false,
        }
      };

      this.map = this.googleMaps.create(element, mapOptions);

      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.onGoogleMapReady();
      })
    }
  }

  onGoogleMapReady() {

    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
      this.showAccesspointPopupDetail(false);
    });
 
    this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((cameraPosition) => {
      this.onMapChangeCenterPosition(cameraPosition.target);
    });


    this.map.getMyLocation().then((position) => {
      let currentPosition: LatLng = position.latLng;
      let cameraPosition: CameraPosition = {
        target: currentPosition,
        zoom: 15,
        tilt: 0
      };
      this.map.moveCamera(cameraPosition);
      this.mWiadsModule.getLocationBaseAccesspoint().setCurrentMapLocation(currentPosition.lat, currentPosition.lng);
    });

  }
  onMapChangeCenterPosition(position) {
    this.mWiadsModule.getLocationBaseAccesspoint().setCurrentMapLocation(position.lat, position.lng);
  }
  showAccesspointPopupDetail(show: boolean) {
    this.mShowPopupDetail = show;
  }

  onResponseBanwidth(data) {
    if (data) {
      this.bandwidths = data;
      this.selectedBanwidth = this.bandwidths[0];
    }
  }



  onResponseProvince(data) {
    if (data) {
      this.provinces = data;
      this.selectedProvince = this.provinces[0];
    }
  }


  selectProvince() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Chọn tỉnh");
    let index = 0;

    for (let province of this.provinces) {
      alert.addInput({
        type: 'radio',
        label: province.name,
        value: province.code + '',
        checked: province.code == this.selectedProvince.code
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          for (let province of this.provinces) {
            if (province.code == data) {
              this.selectedProvince = province;
              this.onInputChange();
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

  selectTime() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Chọn thời gian");
    let index = 0;

    for (let banhwidth of this.bandwidths) {
      alert.addInput({
        type: 'radio',
        label: banhwidth.name,
        value: banhwidth.code + '',
        checked: banhwidth.code == this.selectedBanwidth.code
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          for (let bandwidth of this.bandwidths) {
            if (bandwidth.code + '' == data) {
              this.selectedBanwidth = bandwidth;
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

  goToDetail(accesspoint: AccessPoint) {
    let modal = this.modalCtrl.create(
      "AccesspointDetailModalPage",
      { accesspoint: accesspoint }
    );
    modal.present();
  }
  gotoSearch() {
    this.navCtrl.push("SearchAccesspointPage");
  }

  onInputChange() {
    this.showAccesspointPopupDetail(false);
    if (!this.isShowingLoading) {
      this.showLoading();
    }

    this.accesspoints = [];
    if (this.isViewList()) {
      this.mWiadsModule.getListBaseAccesspoint().setRequestProvince(this.selectedProvince.code);
    } else {
      this.geocoder.geocode({ address: this.selectedProvince.name }).then(data => {
        if (data[0].position) {
          this.map.moveCamera({ target: new LatLng(data[0].position.lat, data[0].position.lng), zoom: 15 });
          this.mWiadsModule.getLocationBaseAccesspoint().setCurrentMapLocation(data[0].position.lat, data[0].position.lng);
        }
      })
    }
  }
}
