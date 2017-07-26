import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AccesspointBandwidth } from '../../../providers/wiads/classes/bandwidth'
import { WiadsModule } from '../../../providers/wiads/wiads';
import Chart from 'chart.js'
@IonicPage()
@Component({
  selector: 'page-wiads-dashboard',
  templateUrl: 'wiads-dashboard.html',
})
export class WiadsDashboardPage {
  provinces = [
    { name: "Hà Nội", code: "HANOI" },
    { name: "Thanh Hóa", code: "THANHHOA" },
    { name: "TP Hồ Chí Minh", code: "HOCHIMINH" },
  ];
  selectedProvince = { name: "TP Hồ Chí Minh", code: "HOCHIMINH" }

  bandwidths: Array<AccesspointBandwidth> = [];
  selectedBanwidth: AccesspointBandwidth = new AccesspointBandwidth();

  accessPoint = {
    online: 15386,
    offline: 3008,
    offline5: 6124
  }
  totalAP = 212249

  advertisment = {
    totalCampaign: 14,
    impression: 205174,
    click: 36463
  }


  constructor(
    private navCtrl: NavController,
    private mWiadsModule: WiadsModule,
    private alertCtrl: AlertController
  ) {

  }

  ionViewDidEnter() {
    console.log("Did enter");
    this.drawAcesspointChart();
    this.drawAdvertisementChart()
    //Get provinces 
    this.mWiadsModule.getProvinces().then((data) => {
      this.onResponseProvince(data);
    }, error => {
    })

    this.mWiadsModule.getBandwidths().then((data) => {
      this.onResponseBanwidth(data);
    })
  }

  onResponseProvince(data) {
    if (data) {
      this.provinces = data;
      this.selectedProvince = this.provinces[0];
    }
  }

  onResponseBanwidth(data) {
    if (data) {
      this.bandwidths = data;
      this.selectedBanwidth = this.bandwidths[0];
    }
  }

  drawAcesspointChart() {
    var datas = [];
    for (var key in this.accessPoint)
      datas.push(this.accessPoint[key]);
    let ctx = document.getElementById("acesspointChart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.accessPoint),
        datasets: [
          {
            label: "Số lần xuất hiện",
            data: datas,
            backgroundColor: ["#90e516", "#ff5152", "#ffd200"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: true,
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
          ctx.font = "normal 1.5em sans-serif";
          ctx.textBaseline = "middle";

          let text = "Tổng AP";
          let textX = Math.round((width - ctx.measureText(text).width) / 2);
          let textY = height / 2 - 40;
          ctx.fillText(text, textX, textY);

          ctx.font = "bold 2.2em sans-serif";
          text = this.totalAP + "";
          textX = Math.round((width - ctx.measureText(text).width) / 2);
          textY = height / 2 - 5;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }
    });
    // Chart.pluginService.register({

    // });

  }

  drawAdvertisementChart() {
    var ctr = "0";
    ctr = (this.advertisment.click * 100 / this.advertisment.impression).toFixed(1);
    let ctx = document.getElementById("advertismentChart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Click through rate"],
        datasets: [
          {
            label: "Click through rate",
            data: [ctr, 100 - parseFloat(ctr)],
            backgroundColor: ["#f97127"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: true,
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
          ctx.font = "normal 1.2em sans-serif";
          ctx.textBaseline = "middle";

          let text = "CTR";
          let textX = Math.round((width - ctx.measureText(text).width) / 2);
          let textY = height / 2 - 30;
          ctx.fillText(text, textX, textY);

          ctx.font = "bold 2em sans-serif";
          text = ctr + "%";
          textX = Math.round((width - ctx.measureText(text).width) / 2);
          textY = height / 2;
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }
    });
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

  gotoSearch() {
    this.navCtrl.push("SearchAccesspointPage");
  }

}
