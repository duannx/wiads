import { ParamBuilder, HttpService } from "../http-service";
import { WiadsCmd } from "./wiads-cmd";
import { WiadsParamsKey } from "./wiads-paramskey";
import { Headers, RequestOptions } from '@angular/http';
import { WiadsAccessToken } from './classes/access-token';
import { AppController } from '../app-controller'


export class WiadsHttpService {

  private mAccessToken: WiadsAccessToken;

  private SERVICE_URL: string = "http://api.wiads.vn/";

  private CLIENT_KEY: string = "8c24516c23b611420defccf253598412";

  private DEVICE_ID: string = "appinasia_macbookpro";

  private CLIENT_ID: string = "1_4qoctizwwaw4gwc400go84gwksswo04cw040scgog44kw4kcc0";

  private CLIENT_SECRET: string = "490drpedg8u84ckcgg84wok0g8o4ckck88o4gcoc0scsk80o40";

  mHeaderWithKey: Headers;
  isDebug = true;
  constructor(private mHttpService: HttpService) {
    if (AppController.getInstance().getPlatform() && !AppController.getInstance().getPlatform().is('cordova')) this.SERVICE_URL = "/";

    this.mAccessToken = new WiadsAccessToken();
    this.mAccessToken.mAccessToken = "OTUxMGI5MmZkYmNhNTkxYWEwODg2NTE5ODU4MmYxZmFiMmE3NDhlNTc3MjYyMTM5ZTVmMTliZWE0MzI2MzI0ZQ";
    this.mAccessToken.mExpiredIn = 3600;
    this.mAccessToken.mRefreshToken = "ZDJlYmVjMmU3ZWE0MzViYzI0Yzk3MzE5NzJjMDNhMzc1NmE5ZDMxOWM4NDEwOGYxNzlhZGUxM2JlMjYxOTE5Yw";
    this.mAccessToken.mScope = "user";
    this.mAccessToken.mType = "bearer";
  }

  private createHeaders() {
    if (this.mHeaderWithKey == null || this.mHeaderWithKey == undefined) {
      this.mHeaderWithKey = new Headers();
      this.mHeaderWithKey.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      this.mHeaderWithKey.append('Authorization', "Bearer " + this.mAccessToken.mAccessToken);
    }
  }
  requestGet(url: string, params: string) {
    console.log("token get", this.mAccessToken.mAccessToken)
    this.createHeaders();
    let options = new RequestOptions({ headers: this.mHeaderWithKey });
    if (this.isDebug) console.log(this.SERVICE_URL + url + params);
    return this.mHttpService.requestGet(url, params, options);
  }

  requestPost(url: string, params: string) {
    this.createHeaders();
    let options = new RequestOptions({ headers: this.mHeaderWithKey });
    if (this.isDebug) console.log(this.SERVICE_URL + url + params);
    return this.mHttpService.requestPost(url, params, { headers: this.mHeaderWithKey });
  }

  requestPut(url: string, params: string) {
    this.createHeaders();
    console.log("body put", params);
    let options = new RequestOptions({ headers: this.mHeaderWithKey });
    return this.mHttpService.requestPut(url, params, { headers: this.mHeaderWithKey });
  }

  testRequest() {


    this.requestAccesspointBWProfile().then(
      data => {
        console.log("============Bandwidth================");
        console.log(JSON.stringify(data));
      }
    );


    this.requestAccesspointFirmware().then(
      data => {
        console.log("============Firmware================");
        console.log(JSON.stringify(data));
      }
    );


    this.requestAccesspointMode().then(
      data => {
        console.log("============Mode================");
        console.log(JSON.stringify(data));
      }
    );


    this.requestAccesspointTemplateLogin().then(
      data => {
        console.log("============Template Login================");
        console.log(JSON.stringify(data));
      }
    );



    this.requestCompany().then(
      data => {
        console.log("============Company================");
        console.log(JSON.stringify(data));
      }
    );




    this.requestCustomer().then(
      data => {
        console.log("============Customer================");
        console.log(JSON.stringify(data));
      }
    );



    this.requestProvince().then(
      data => {
        console.log("============Province================");
        console.log(JSON.stringify(data));
      }
    );



    this.requestRole().then(
      data => {
        console.log("============Role================");
        console.log(JSON.stringify(data));
      }
    );


    this.requestUser().then(
      data => {
        console.log("============Users================");
        console.log(JSON.stringify(data));
      }
    );


  }


  /**For tolen */
  getAccesstoken() {
    return this.mAccessToken;
  }

  getToken() {
    return this.mAccessToken;
  }
  hasToken() {
    return this.mAccessToken.hasToken();
  }

  onResponseAccessToken(data) {
    this.mAccessToken.onResponseToken(data);
  }



  // 1.1 Login
  requestLogin(username: string, password: string) {
    console.log("token login", this.mAccessToken.mAccessToken)
    let url = this.SERVICE_URL + WiadsCmd.LOGIN;
    //Browser only
    if (AppController.getInstance().getPlatform() && !AppController.getInstance().getPlatform().is('cordova')) url = "http://api.wiads.vn/" + WiadsCmd.LOGIN;
    return this.mHttpService.requestPost(url, ParamBuilder.builder()
      .add(WiadsParamsKey.CLIENT_ID, this.CLIENT_ID)
      .add(WiadsParamsKey.CLIENT_SECRET, this.CLIENT_SECRET)
      .add(WiadsParamsKey.GRANT_TYPE, "password")
      .add(WiadsParamsKey.USERNAME, username)
      .add(WiadsParamsKey.PASSWORD, password)
      .build());
  }

  //1.2 Get list accesspoint
  requestAccesspoint(province?: string, macaddr?: string, text?: string, owner?: string,
    from_date?: string, to_date?: string, page?: number, limit?: number) {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_LIST, ParamBuilder.builder()
      .addIgnoreNull(WiadsParamsKey.PROVINCE, province)
      .addIgnoreNull(WiadsParamsKey.MAC_ADDRESS, macaddr)
      .addIgnoreNull(WiadsParamsKey.TEXT, text)
      .addIgnoreNull(WiadsParamsKey.OWNER, owner)
      .addIgnoreNull(WiadsParamsKey.FROM_DATE, from_date)
      .addIgnoreNull(WiadsParamsKey.TO_DATE, to_date)
      .addIgnoreNull(WiadsParamsKey.PAGE, page)
      .addIgnoreNull(WiadsParamsKey.LIMIT, limit)
      .build());
  }
  //1.2 Get list accesspoint
  requestAccesspointList(page: number, limit: number, province?: string, fromDate?: string, toDate?: string) {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_LIST, ParamBuilder.builder()
      .addIgnoreNull(WiadsParamsKey.PROVINCE, province)
      .add(WiadsParamsKey.PAGE, page)
      .add(WiadsParamsKey.LIMIT, limit)
      .addIgnoreNull(WiadsParamsKey.FROM_DATE, fromDate)
      .addIgnoreNull(WiadsParamsKey.TO_DATE, toDate)
      .build());
  }

  //1.3 Get accesspoint Bw profile (Danh sách các tốc độ và thời gian sử dụng)
  requestAccesspointBWProfile() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_BANDWIDTH_PROFILE, ParamBuilder.builder().build());
  }

  //1.4 Get accesspoint firmware
  requestAccesspointFirmware() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_FIRMWARE, ParamBuilder.builder().build());
  }

  //1.5 Get info one accesspoint
  requestAccesspointInfo(macaddr: string) {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_INFO, ParamBuilder.builder()
      .add(WiadsParamsKey.MAC_ADDRESS, macaddr)
      .build());
  }

  //1.6 Get accesspoint location
  requestAccesspointLocation(lat: number, lng: number, page: number, limit: number, radius?: number) {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_LOCATION, ParamBuilder.builder()
      .add(WiadsParamsKey.LAT, lat)
      .add(WiadsParamsKey.LONG, lng)
      .add(WiadsParamsKey.PAGE, page)
      .add(WiadsParamsKey.LIMIT, limit)
      .addIgnoreNull(WiadsParamsKey.RADIUS, radius)
      .build());
  }


  //1.7 Get accesspoint mode
  requestAccesspointMode() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_MODE, ParamBuilder.builder().build());
  }

  //1.8 Reboot Accesspoint (err: method not allow)
  requestRebootAccesspoint(macaddr: string) {
    return this.requestPut(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_REBOOT, ParamBuilder.builder()
      .add(WiadsParamsKey.MAC_ADDRESS, macaddr)
      .build());
  }

  //1.9  Get accesspoint template login (Danh sách màn hình login)
  requestAccesspointTemplateLogin() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_TEMPLATE_LOGIN, ParamBuilder.builder().build());
  }

  //1.10 Update Accesspoint (err: Method not allowed)
  requestUpdateAccesspoint(macaddr: string) {
    return this.requestPut(this.SERVICE_URL + WiadsCmd.ACCESSPOINT_UPDATE, ParamBuilder.builder()
      .add(WiadsParamsKey.MAC_ADDRESS, macaddr)
      .build());
  }

  //1.11 Get list advertiser
  requestAdvertiser(location?: string, platform?: string, status?: number, owner?: string, customer?: string,
    from_date?: string, to_date?: string, page?: number, limit?: number) {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ADVERTISER_LIST, ParamBuilder.builder()
      .addIgnoreNull(WiadsParamsKey.LOCATION, location)
      .addIgnoreNull(WiadsParamsKey.PLATFORM, platform)
      .addIgnoreNull(WiadsParamsKey.STATUS, status)
      .addIgnoreNull(WiadsParamsKey.OWNER, owner)
      .addIgnoreNull(WiadsParamsKey.CUSTOMER, customer)
      .addIgnoreNull(WiadsParamsKey.FROM_DATE, from_date)
      .addIgnoreNull(WiadsParamsKey.TO_DATE, to_date)
      .addIgnoreNull(WiadsParamsKey.PAGE, page)
      .addIgnoreNull(WiadsParamsKey.LIMIT, limit)
      .build());
  }

  //1.12 Get advertiser detail
  requestAdvertiserDetail(id: number) {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ADVERTISER_DETAIL, ParamBuilder.builder()
      .add(WiadsParamsKey.ID, id)
      .build());
  }

  //1.13 Update advertiser (err: method not allowed)
  requestUpdateAdvertiser(id: number, title?: string, campagin?: string, description?: string, location?: Array<string>,
    platform?: Array<string>, published_at?: string, expired_at?: string, link?: string, img_1?: string, img_2?: string, status?: number) {
    return this.requestPut(this.SERVICE_URL + WiadsCmd.ADVERTISER_UPDATE, ParamBuilder.builder()
      .add(WiadsParamsKey.ID, id)
      .addIgnoreNull(WiadsParamsKey.TITLE, title)
      .addIgnoreNull(WiadsParamsKey.CAMPAGIN, campagin)
      .addIgnoreNull(WiadsParamsKey.DESCRIPTION, description)
      .addIgnoreNull(WiadsParamsKey.LOCATION_ARRAY, location)
      .addIgnoreNull(WiadsParamsKey.PLATFORM_ARRAY, platform)
      .addIgnoreNull(WiadsParamsKey.PUBLISHED_AT, published_at)
      .addIgnoreNull(WiadsParamsKey.EXPIRED_AT, expired_at)
      .addIgnoreNull(WiadsParamsKey.LINK, link)
      .addIgnoreNull(WiadsParamsKey.IMG_1, img_1)
      .addIgnoreNull(WiadsParamsKey.IMG_2, img_2)
      .addIgnoreNull(WiadsParamsKey.STATUS, status)
      .build());
  }

  //1.14 Get list company
  requestCompany() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.COMPANY_LIST, ParamBuilder.builder().build());
  }

  //1.15 Get list customer
  requestCustomer() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.CUSTOMER_LIST, ParamBuilder.builder().build());
  }

  //1.16 Get list platform
  requestPlatform() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.PLATFORM_LIST, ParamBuilder.builder().build());
  }

  //1.17 Get list province
  requestProvince() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.PROVINCE_LIST, ParamBuilder.builder().build());
  }

  //1.18 Get role
  requestRole() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.ROLE_LIST, ParamBuilder.builder().build());
  }

  //1.19 Get list users
  requestUser() {
    return this.requestGet(this.SERVICE_URL + WiadsCmd.USERS, ParamBuilder.builder().build());
  }

  //1.20 Change password
  requestChangePass(pw_current: string, pw_new: string) {
    return this.requestPut(this.SERVICE_URL + WiadsCmd.USERS_CHANGE_PASSWORD, ParamBuilder.builder()
      .add(WiadsParamsKey.PASSWORD_CURRENT, pw_current)
      .add(WiadsParamsKey.PASSWORD_NEW, pw_new)
      .build());
  }

  //1.21 Edit user
  requestEditUser(name?: string, company?: string, phone?: string) {
    return this.requestPut(this.SERVICE_URL + WiadsCmd.USERS_EDIT, ParamBuilder.builder()
      .addIgnoreNull(WiadsParamsKey.NAME, name)
      .addIgnoreNull(WiadsParamsKey.COMPANY, company)
      .addIgnoreNull(WiadsParamsKey.PHONE, phone)
      .build());
  }


}
