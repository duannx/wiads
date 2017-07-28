import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, ToastController, Content, ItemSliding, Item, ModalController, AlertController } from 'ionic-angular';
import { WiadsModule } from '../../../providers/wiads/wiads';
import { } from '../../../providers/wiads/classes/'
import Chart from 'chart.js'
@IonicPage()
@Component({
  selector: 'page-wiads-advertisement',
  templateUrl: 'wiads-adsvertisement.html',
})
export class WiadsAdsvertisementPage {
  @ViewChild(Content) content: Content;
  customers = [{ name: "Wiads", code: "Wiads" }, { name: "BGate", code: "BGate" }];
  selectedCustomer = { name: "Khách hàng", code: "Khách hàng" };
  positions = [{ name: "Toàn màn thời gian", code: "Toàn màn thời gian" }, { name: "Bán màn thời gian", code: "Bán màn thời gian" }];
  selectedPosition = { name: "Toàn màn thời gian", code: "Toàn màn thời gian" };
  chartDatas = [[1000, 2000, 1500, 5000, 2500, 3000], [2000, 3000, 1000, 1500, 6000, 3000]];
  labels = ['01/2017', '02/2017', '03/2017', '04/2017', '05/2017', '06/2017'];
  advertisments = [];
  mDoLoadMore: boolean = false;
  activeItemSliding: ItemSliding = null;
  constructor(
    private navCtrl: NavController,
    private mWiadsModule: WiadsModule,
    private mToastController: ToastController,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.addItems();
  }


  ionViewDidEnter() {
    this.drawChart();
    this.content.ionScrollEnd.subscribe(() => {
      this.onScrollEnd();
    });
  }

  drawChart() {
    let ctx = document.getElementById("advertismentChart1");
    var myLine = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Active Advertisement",
            data: this.chartDatas[0],
            borderColor: "#f97127",
            backgroundColor: 'transparent'
          }, {
            label: "Inactive Advertisement",
            data: this.chartDatas[1],
            borderColor: "#90e516",
            backgroundColor: 'transparent'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }

  addItems() {
    if (this.advertisments.length >= 200) return;
    let length = this.advertisments.length;
    for (let i = length; i < length + 20; i++) {
      this.advertisments.push({
        id: i,
        name: "Quảng cáo Spider man - Home coming",
        impression: Math.floor(Math.random() * 20 + 10),
        click: Math.floor(Math.random() * 20),
        conversion: Math.floor(Math.random() * 20) + '%',
        endDate: '06-07-2017'
      })
    }
  }
  deleteItem(advertisement) {
    let alert = this.alertCtrl.create({
      message: "Bạn có chắc chăn muốn xóa quảng cáo này: ",
      buttons: [{
        text: "Cancel"
      }, {
        text: "OK",
        handler: () => {
          let index = this.advertisments.findIndex(elm => {
            return elm.id == advertisement.id;

          })
          if (index > -1) this.advertisments.splice(index, 1);
        }
      }]
    });
    alert.present();

  }
  slide(item: ItemSliding) {
    console.log("sliding", item);
    item.moveSliding(50);
  }

  onScrollEnd() {
    if (this.mDoLoadMore) return;
    this.mDoLoadMore = true;
    // this.mWiadsModule.getListBaseAccesspoint().doLoadMore((items) => {
    //   for (let item of items) {
    //     let accesspoint = new AccessPoint();
    //     accesspoint.pair(item);
    //     this.accesspoints.push(item);
    //   }
    //   this.mDoLoadMore = false;
    // }); 
    setTimeout(() => {
      this.zone.run(() => {
        this.addItems();
      });
      this.mDoLoadMore = false;
    }, 2000)

  }
  openOption(itemSlide: ItemSliding, item: Item, event) {
    console.log('opening item slide..');
    event.stopPropagation();
    if (this.activeItemSliding !== null) {
      this.closeOption();
    }//use this if only one active sliding item allowed 
    this.activeItemSliding = itemSlide;

    let swipeAmount = 120; //set your required swipe amount

    itemSlide.startSliding(swipeAmount);
    itemSlide.moveSliding(swipeAmount);

    itemSlide.setElementClass('active-options-right', true);

    item.setElementStyle('transition', null);
    item.setElementStyle('transform', 'translate3d(-' + swipeAmount + 'px, 0px, 0px)');
    // itemSlide.startSliding(360); //any number can do
    // itemSlide.moveSliding(330); // any number small than the previous one
    // this.activeItemSliding = itemSlide;
    // setTimeout(() => {
    //   itemSlide.moveSliding(320); // any number smaller than the previous one
    //   itemSlide.endSliding(0.3); // you can mock anything less than 0.3
    // }, 100);
  }
  closeOption() {
    console.log('closing item slide..');

    if (this.activeItemSliding) {
      this.activeItemSliding.close();
      this.activeItemSliding = null;
    }
  }
  gotoDetail(advertisment?: any) {
    let option = {};
    if (advertisment) option["advertisment"] = advertisment;
    let modal = this.modalCtrl.create(
      "AdvertismentDetailPage",
      option
    );
    modal.present();
  }
  selectCustomer() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Chọn khách hàng");
    let index = 0;

    for (let item of this.customers) {
      alert.addInput({
        type: 'radio',
        label: item.name,
        value: item.code + '',
        checked: item.code == this.selectedCustomer.code
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          for (let item of this.customers) {
            if (item.code + '' == data) {
              this.selectedCustomer = item;
              break;
            }
          }
        }
      }
    });
    alert.present();
  }
  selectPosition() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Chọn khách vị trí");
    let index = 0;

    for (let item of this.positions) {
      alert.addInput({
        type: 'radio',
        label: item.name,
        value: item.code + '',
        checked: item.code == this.selectedPosition.code
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          for (let item of this.positions) {
            if (item.code + '' == data) {
              this.selectedPosition = item;
              break;
            }
          }
        }
      }
    });
    alert.present();
  }
}
