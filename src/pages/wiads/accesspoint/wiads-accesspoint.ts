import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, Loading, ModalController } from 'ionic-angular';
import { WiadsModule } from '../../../providers/wiads/wiads';
import { AccessPoint } from '../../../providers/wiads/classes/accesspoint';
import { Province } from '../../../providers/wiads/classes/province';
import { AccesspointBandwidth } from '../../../providers/wiads/classes/bandwidth';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  GoogleMapOptions,
  Geocoder,
  GeocoderRequest,
  Marker, HtmlInfoWindow
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-wiads-accesspoint',
  templateUrl: 'wiads-accesspoint.html',
})
export class WiadsAccesspointPage {
  selectedAccesspoint: AccessPoint;
  popup: HTMLElement;
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
  modeToggle = true; //True = list; false = map

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
      if (this.modeToggle && !this.mDoLoadMore) {
        this.accesspoints = [];
        for (let item of items) {
          this.accesspoints.push(item);
        }

        if (this.loading) this.loading.dismiss();
      }
    });

    this.mWiadsModule.getLocationBaseAccesspoint().setOnChangeListener((items, additionItems) => {
      if (!this.modeToggle) {
        //Add marker
        for (let item of additionItems) {
          // let accesspoint = additionItems[i];
          let accesspoint = new AccessPoint();
          accesspoint.pair(item);
          if (accesspoint.mLat && accesspoint.mLng) {
            let latlng = new LatLng(accesspoint.mLat, accesspoint.mLng);
            //Check marker exists
            if (this.latLngMarker.findIndex(elm => {
              return elm.equals(latlng);
            }) == -1) {
              // let infoWindow = new HtmlInfoWindow();
              // let div = document.createElement('div');
              // div.style.width = '100px';
              // div.style.height = '100px';
              // div.style.backgroundColor = '#333';
              // let spanElm = document.createElement('span');
              // spanElm.style.color = "#FFF";
              // spanElm.innerText = "Hello. Its me";
              // infoWindow.setContent(div);
              // div.appendChild(spanElm);
              //Add marker
              this.map.addMarker({
                title: accesspoint.mName,
                snippet: accesspoint.mAddress,
                position: latlng,
              }).then(marker => {
                marker = marker as Marker;
                marker.prototype
                this.latLngMarker.push(latlng);
                marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((event) => {
                  console.log("MARKER_CLICK");

                  // infoWindow.open(marker);

                  this.selectedAccesspoint.mName = accesspoint.mName;
                  this.selectedAccesspoint.mAddress = accesspoint.mAddress;
                  this.selectedAccesspoint.mLastTimeOnline = accesspoint.mLastTimeOnline;
                  if (this.popup) this.popup.classList.remove('wa-hide');
                })
              })
            }
          }
        }
        if (this.loading) this.loading.dismiss();
      }
    })
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


  ionViewDidEnter() {
    if (!this.isEntered) {
      this.loading = this.loadingCtrl.create({
        content: "Xin đợi",
        duration: 5000,
        dismissOnPageChange: true
      })
      this.loading.present();
      this.loading.onDidDismiss(() => {
        this.isShowingLoading = false;
      })
      this.isShowingLoading = true;
      console.log("did enter this.modeToggle", this.modeToggle, this.provinces, this.accesspoints);
      this.popup = document.getElementById('wa-ap-detail');
      //Toggle change
      let toggleButtons = document.getElementsByClassName('custom-toggle-button');
      if (toggleButtons) {
        for (let i = 0; i < toggleButtons.length; i++) {
          toggleButtons[i].addEventListener('touchend', (event) => {
            console.log("this.modeToggle", this.modeToggle);
            toggleButtons[i].classList.toggle("active");
            this.modeToggle = !this.modeToggle;
            if (toggleButtons[i].nextElementSibling)
              toggleButtons[i].nextElementSibling.classList.toggle("active");
            if (toggleButtons[i].previousElementSibling)
              toggleButtons[i].previousElementSibling.classList.toggle("active");
            this.toggleView(!this.modeToggle);
            if (!this.modeToggle) this.accesspoints = [];
            if (this.modeToggle) if (this.popup) this.popup.classList.add('wa-hide');
            this.onInputChange();
          })
        }
      }

      //Load map
      let mapOptions: GoogleMapOptions = {
        mapType: 'MAP_TYPE_NORMAL',
        controls: {
          compass: false,
          myLocationButton: true,
          indoorPicker: false,
          mapToolbar: false
        },
        gestures: {
          scroll: true,
          tilt: false,
          zoom: true,
          rotate: false,
        },
      }
      let element: HTMLElement = document.getElementById('wa-map-1');
      this.map = this.googleMaps.create(element);
      this.map.setVisible(false);
      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.map.setOptions(mapOptions);
        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((camera) => {
          console.log("MAP_CLICK");
          if (this.popup) this.popup.classList.add('wa-hide');
        });
        this.map.on("map_drag_end").subscribe((camera) => {
          if (this.popup) this.popup.classList.add('wa-hide');
        });
        this.map.on("camera_move_end").subscribe((camera) => {
          this.mWiadsModule.getLocationBaseAccesspoint().setCurrentMapLocation(camera.target["lat"], camera.target["lng"]);
        })
      })

      //Get provinces
      this.mWiadsModule.getProvinces().then((data) => {
        this.onResponseProvince(data);
        //Get AP
        this.onInputChange();
      }, error => {
      })

      this.mWiadsModule.getBandwidths().then((data) => {
        this.onResponseBanwidth(data);
      })
    }
    this.isEntered = true;
  }

  onResponseBanwidth(data) {
    if (data) {
      this.bandwidths = data;
      this.selectedBanwidth = this.bandwidths[0];
    }
  }

  onInputChange() {
    if (!this.isShowingLoading) {
      if (this.loading) this.loading.dismiss();
      this.loading = this.loadingCtrl.create({
        content: "Xin đợi",
        duration: 5000,
        dismissOnPageChange: true
      })
      this.loading.present();
      this.loading.onDidDismiss(() => {
        this.isShowingLoading = false;
      })
    }
    //Get AP for list
    if (this.modeToggle) {
      if (this.map) this.map.setVisible(false)
      this.mWiadsModule.getListBaseAccesspoint().setRequestProvince(this.selectedProvince.code);
    } else {
      //get AP for map
      this.geocoder.geocode({ address: this.selectedProvince.name }).then(data => {
        if (data[0].position) {

          this.map.moveCamera({ target: new LatLng(data[0].position.lat, data[0].position.lng), zoom: 15 });
          this.mWiadsModule.getLocationBaseAccesspoint().setCurrentMapLocation(data[0].position.lat, data[0].position.lng);
        }
      })
    }
  }

  onResponseProvince(data) {
    if (data) {
      this.provinces = data;
      this.selectedProvince = this.provinces[0];
    }
  }
  toggleView(mapVisible) {
    let mapContainer = document.getElementById("wa-map-container");
    let listContainer = document.getElementById("wa-list-container");

    if (mapContainer) mapContainer.style.display = mapVisible ? "block" : "none";
    if (listContainer) listContainer.style.display = mapVisible ? "none" : "block";


    if (this.map) {
      this.map.setVisible(mapVisible);
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
}
