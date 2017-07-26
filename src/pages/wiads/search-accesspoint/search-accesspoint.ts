import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { WiadsModule } from '../../../providers/wiads/wiads';
import { Province } from '../../../providers/wiads/classes/province'
import { AccessPoint } from '../../../providers/wiads/classes/accesspoint'
@IonicPage()
@Component({
  selector: 'page-search-accesspoint',
  templateUrl: 'search-accesspoint.html',
})
export class SearchAccesspointPage {
  mSearchInput = "";
  searchCurrentTime = 0;
  accesspoints = [];
  currentPage = 1;
  maxPage = 0;
  limit = 20;
  isShowHistory = true;
  isShowLoading = false;
  provinces: Array<Province> = [];
  selectedProvince = new Province();
  isShowCancelButton = false;
  isLoadMore = false;
  onlineMode = [
    {
      name: "Online",
      value: 1
    },
    {
      name: "Offline",
      value: 0
    },
    {
      name: "Off2Ngay",
      value: 2
    },
    {
      name: "Off5Ngay",
      value: 5
    },
    {
      name: "Off7Ngay",
      value: 7
    },
  ];
  selectedOnlineMode = { name: "Online", value: 1 }

  times = [
    {
      name: "homnay",
      value: 0
    },
    {
      name: "homqua",
      value: 1
    },
    {
      name: "1tuantruoc",
      value: 2
    },
    {
      name: "2tuantruoc",
      value: 3
    },
    {
      name: "1thangtruoc",
      value: 4
    },
  ]
  selectedTime = { name: "homnay", value: 0 };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private mWiadsModule: WiadsModule,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private renderer: Renderer,
    public platform: Platform) {
    this.platform.ready().then(() => {
      if (this.platform.is("ios")) this.isShowCancelButton = true;
    })
  }

  ionViewDidLoad() {
    this.mWiadsModule.getProvinces().then((data) => {
      this.onResponseProvince(data);
    }, error => {
    })
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
              break;
            }
          }
        }
      }
    });
    alert.present();
  }
  getLowerCase(str: string) {
    return str.toString().toLowerCase();
  }

  selectInputProvince(province: Province) {
    this.selectedProvince = province;
    this.onSearchInput(1);
  }
  selectInputOnlineMode(mode) {
    this.selectedOnlineMode = mode;
  }
  selectInputTime(time) {
    this.selectedTime = time;
  }
  onSearchInput(currentPage: number, infiniteScroll?: any) {
    if (currentPage > this.maxPage && this.currentPage > 1) {
      if (infiniteScroll) {
        infiniteScroll.complete();
        this.isLoadMore = false;
      }
      return;
    }
    this.currentPage = currentPage;
    this.isShowHistory = false;
    let currentTime = Date.now();
    this.searchCurrentTime = currentTime;
    if (this.currentPage <= 1) {
      this.isShowLoading = true;
      this.accesspoints = [];
    }
    this.mWiadsModule.searchAccesspoint(this.selectedProvince.code, this.mSearchInput.trim(), this.currentPage, this.limit).then(data => {
      this.isShowLoading = false;
      if (currentTime != this.searchCurrentTime && !this.isLoadMore) {
        if (infiniteScroll) {
          infiniteScroll.complete();
          this.isLoadMore = false;
        }
        return;
      }
      if (data && data["code"] == 1) {
        this.maxPage = +data["page_info"]["total"];
        this.currentPage = +data["page_info"]["current"];
        this.limit = +data["page_info"]["limit"];
        if (data["data"] && data["data"].length > 0) {
          data["data"].forEach(element => {
            if (currentTime != this.searchCurrentTime && !this.isLoadMore) {
              if (infiniteScroll) {
                infiniteScroll.complete();
                this.isLoadMore = false;
              }
              return;
            }
            let accesspoint = new AccessPoint();
            accesspoint.onResponseData(element);
            this.accesspoints.push(accesspoint);
          });
        }
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
        this.isLoadMore = false;
      }
      console.log(this.accesspoints);
    }, error => {
      if (infiniteScroll) {
        infiniteScroll.complete();
        this.isLoadMore = false;
      }
    });
  }
  doInfinite(infiniteScroll) {
    this.isLoadMore = true;
    console.log("do infinite", this.currentPage, this.maxPage, this.accesspoints.length);
    this.onSearchInput(this.currentPage + 1, infiniteScroll);
  }
  goToDetail(accesspoint: AccessPoint) {
    let modal = this.modalCtrl.create(
      "AccesspointDetailModalPage",
      { accesspoint: accesspoint }
    );
    modal.present();
  }
  onClickBack() {
    this.navCtrl.pop();
  }
  onSearch(event) {
    this.renderer.invokeElementMethod(event.target, 'blur');
  }
}
