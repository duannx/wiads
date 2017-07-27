import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AccessPoint } from '../../../../providers/wiads/classes/accesspoint';
import { AccesspointBandwidth } from '../../../../providers/wiads/classes/bandwidth';
import { TemplateLogin } from '../../../../providers/wiads/classes/template-login';
import { WiadsModule } from '../../../../providers/wiads/wiads';


import Chart from 'chart.js'
@IonicPage()
@Component({
  selector: 'page-accesspoint-detail-modal',
  templateUrl: 'accesspoint-detail-modal.html',
})
export class AccesspointDetailModalPage {
  accesspoint: AccessPoint;
  advertisment = {
    totalPopUp: 198898,
    totalClick: 188846
  }
  statistic = [
  ]

  bandwidths: Array<AccesspointBandwidth> = [];
  selectedBanwidth: AccesspointBandwidth = new AccesspointBandwidth();

  templateLogins: Array<TemplateLogin> = [];
  selectedtemplateLogin: TemplateLogin = new TemplateLogin();

  modes = [
    {
      "name": "Chế độ hiển thị LOGIN (QC)",
      "code": "option normal_mode 0"
    },
    {
      "name": "Chế độ thường",
      "code": "option normal_mode 1"
    }
  ]

  selectedMode = {
    "name": "Chế độ hiển thị LOGIN (QC)",
    "code": "option normal_mode 0"
  }

  startTime = new Date("2017/07/01");
  endTime = new Date("2017/07/31");
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private mWiadsModule: WiadsModule, private alertCtrl: AlertController) {
    this.accesspoint = new AccessPoint();
    let inputAP = this.navParams.get("accesspoint");
    if (inputAP) this.accesspoint = inputAP;
    for (let i = 1; i <= 31; i++) {
      let day = { day: "00", click: 0, status: 0 }
      day.day = i < 10 ? "0" + i : i + '';
      day.click = Math.round(Math.random() * 10);
      day.status = Math.floor(Math.random() * 2);
      this.statistic.push(day);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccesspointDetailModalPage');
    this.mWiadsModule.getBandwidths().then((data) => {
      this.onResponseBanwidth(data);
    })

    this.mWiadsModule.getTemplateLogins().then(data => {
      this.onResponseTemplateLogin(data);
    })

    this.drawChart();
  }

  onResponseBanwidth(data) {
    if (data) {
      this.bandwidths = data;
      this.selectedBanwidth = this.bandwidths[0];
    }
  }

  onResponseTemplateLogin(data) {
    if (data) {
      this.templateLogins = data;
      this.selectedtemplateLogin = this.templateLogins[0];
    }
  }

  drawChart() {
    var ctr = "0";
    ctr = (this.advertisment.totalClick * 100 / this.advertisment.totalPopUp).toFixed(1);
    let ctx = document.getElementById("ap-detail-chart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Click through rate"],
        datasets: [
          {
            label: "Click through rate",
            data: [ctr, 100 - parseFloat(ctr)],
            backgroundColor: ["#90e516"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false,
          position: 'bottom'
        },
        cutoutPercentage: 70
      },
      plugins: {
        beforeDraw: (chart) => {
          var width = chart.chart.width;
          var height = chart.chart.height;
          var ctx = chart.chart.ctx;

          ctx.restore();
          ctx.font = "normal 1em sans-serif";
          ctx.textBaseline = "middle";

          let text = "Click/Popup";
          let textX = Math.round((width - ctx.measureText(text).width) / 2);
          let textY = height / 2 - 15;
          ctx.fillText(text, textX, textY);

          ctx.font = "bold 1.8em sans-serif";
          text = ctr + "%";
          textX = Math.round((width - ctx.measureText(text).width) / 2);
          textY = height / 2 + 15;
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }
    });
  }

  onClickBack() {
    this.viewCtrl.dismiss();
  }

  getViewDate(date: Date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + date.getFullYear();
  }

  selectBanwidth() {
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

  selectTemplateLogin() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Chọn kiểu đăng nhập");
    let index = 0;

    for (let template of this.templateLogins) {
      alert.addInput({
        type: 'radio',
        label: template.name,
        value: template.code + '',
        checked: template.code == this.selectedtemplateLogin.code
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          for (let template of this.templateLogins) {
            if (template.code + '' == data) {
              this.selectedtemplateLogin = template;
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

  selectMode(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Chọn chế độ hoạt động");
    let index = 0;

    for (let mode of this.modes) {
      alert.addInput({
        type: 'radio',
        label: mode.name,
        value: mode.code + '',
        checked: mode.code == this.selectedMode.code
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          for (let mode of this.modes) {
            if (mode.code + '' == data) {
              this.selectedMode = mode;
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

}
