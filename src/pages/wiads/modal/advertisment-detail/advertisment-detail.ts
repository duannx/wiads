import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-advertisment-detail',
  templateUrl: 'advertisment-detail.html',
})
export class AdvertismentDetailPage {
  tab = 'information';
  advertisment = {};
  title = "Thêm mới quảng cáo";
  customers = [{ name: "Wiads", code: "Wiads" }, { name: "BGate", code: "BGate" }];
  statuses = [{ name: "Kích hoạt", code: "Kích hoạt" }, { name: "Tắt", code: "Tắt" }];
  positions = [{ name: "Toàn màn hình", code: "Toàn màn hình" }, { name: "Tùy biến", code: "Tùy biến" }];
  targets = [{ name: "Tất cả", code: "Tất cả" }, { name: "Không", code: "Không" }];
  operationSystems = [{ name: "Samsung", code: "Samsung" }, { name: "IOS", code: "IOS" }]
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController) {
    let param = navParams.get('advertisment');
    if (param) {
      this.advertisment = param;
      this.title = param.name || "Thêm mới quảng cáo";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvertismentDetailPage');
  }
  onClickBack() {
    this.viewCtrl.dismiss();
  }

  selectCustomer() {
    this.showSelection(this.customers, "Chọn khách hàng", "customer");
  }
  selectStatus() {
    this.showSelection(this.statuses, "Chọn trạng thái", "status");
  }
  selectPosition() {
    this.showSelection(this.positions, "Chọn vị trí", "position");
  }
  selectImage() {

  }
  selectLoginImage() {

  }
  selectTarget() {
    this.showSelection(this.targets, "Chọn target", "target");
  }
  selectOS() {
    this.showSelection(this.operationSystems, "Chọn hệ điều hành", "operatingSystem");
  }
  showSelection(items, title: string, field) {
    let alert = this.alertCtrl.create();
    alert.setTitle(title);
    let index = 0;

    for (let item of items) {
      alert.addInput({
        type: 'radio',
        label: item.name,
        value: item.code + '',
        checked: item.code == this.advertisment[field]
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          this.advertisment[field] = data;
        }
      }
    });
    alert.present();
  }
}
