
import { Injectable } from '@angular/core';
import { HttpService } from "../http-service";
import { WiadsHttpService } from "./wiads-http-service";
import { Storage } from "@ionic/storage";

import { BandwidthController } from './controller/bandwidth-controller';
import { FirmwareController } from './controller/firmware-controller';
import { ProvinceController } from './controller/province-controller';
import { TemplateLoginController } from './controller/templatelogin-controller';

import { LocationBaseAccesspointController } from './controller/location-accesspoint-controller';
import { ListAccesspointController } from './controller/list-accesspoint-controller';
import { AccesspointPool } from './classes/accesspoint-pool';

@Injectable()
export class WiadsModule {
    private mWiadsHttpService: WiadsHttpService;

    private mBandwidthController: BandwidthController;
    private mFirmwareController: FirmwareController;
    private mProvinceController: ProvinceController;
    private mTemplateLoginController: TemplateLoginController;

    private mAccesspointPool: AccesspointPool;
    private mLocationBaseAccesspoint: LocationBaseAccesspointController;
    private mListBaseAccesspoint: ListAccesspointController;
    constructor(private mHttpService: HttpService, private mStorage: Storage) {

        this.mWiadsHttpService = new WiadsHttpService(mHttpService);
        this.mBandwidthController = new BandwidthController();
        this.mFirmwareController = new FirmwareController();
        this.mProvinceController = new ProvinceController();
        this.mTemplateLoginController = new TemplateLoginController();
        this.mAccesspointPool = new AccesspointPool();

        this.mLocationBaseAccesspoint = new LocationBaseAccesspointController();
        this.mLocationBaseAccesspoint.setHttpServiceProvider(this.mWiadsHttpService);
        this.mLocationBaseAccesspoint.setObjectPool(this.mAccesspointPool);

        this.mListBaseAccesspoint = new ListAccesspointController();
        this.mListBaseAccesspoint.setHttpServiceProvider(this.mWiadsHttpService);
        this.mListBaseAccesspoint.setObjectPool(this.mAccesspointPool);

        // this.mListBaseAccesspoint.setOnChangeListener((items) => {
        //     console.log("=========On Data Change===========");
        //     console.log(items);
        // });


    }

    /**===================Get Functions=================== */
    getHttpService() {
        return this.mWiadsHttpService;
    }
    getBandwidths() {
        if (this.mBandwidthController.ready()) {
            return new Promise(
                (resolve, reject) => {
                    resolve(this.mBandwidthController.getItems());
                }
            );
        }

        return new Promise(
            (resolve, reject) => {
                this.mWiadsHttpService.requestAccesspointBWProfile().then(
                    data => {
                        this.mBandwidthController.onResponseData(data);
                        resolve(this.mBandwidthController.getItems());
                    },
                    error => {
                        reject();
                    }
                );
            }
        );
    }
    getTemplateLogins() {
        if (this.mTemplateLoginController.ready()) {
            return new Promise(
                (resolve, reject) => {
                    resolve(this.mTemplateLoginController.getItems());
                }
            );
        }

        return new Promise(
            (resolve, reject) => {
                this.mWiadsHttpService.requestAccesspointTemplateLogin().then(
                    data => {
                        this.mTemplateLoginController.onResponseData(data);
                        resolve(this.mTemplateLoginController.getItems());
                    },
                    error => {
                        reject();
                    }
                );
            }
        );
    }
    getProvinces() {
        if (this.mProvinceController.ready()) {
            return new Promise(
                (resolve, reject) => {
                    resolve(this.mProvinceController.getItems());
                }
            );
        }

        return new Promise(
            (resolve, reject) => {
                this.mWiadsHttpService.requestProvince().then(
                    data => {
                        this.mProvinceController.onResponseData(data);
                        resolve(this.mProvinceController.getItems());
                    },
                    error => {
                        reject();
                    }
                );
            }
        );
    }
    getFirmwares() {
        if (this.mFirmwareController.ready()) {
            return new Promise(
                (resolve, reject) => {
                    resolve(this.mFirmwareController.getItems());
                }
            );
        }

        return new Promise(
            (resolve, reject) => {
                this.mWiadsHttpService.requestAccesspointFirmware().then(
                    data => {
                        this.mFirmwareController.onResponseData(data);
                        resolve(this.mFirmwareController.getItems());
                    },
                    error => {
                        reject();
                    }
                );
            }
        );
    }
    getAccesspointPool() {
        return this.mAccesspointPool;
    }

    getLocationBaseAccesspoint(): LocationBaseAccesspointController {
        return this.mLocationBaseAccesspoint;
    }
    getListBaseAccesspoint(): ListAccesspointController {
        return this.mListBaseAccesspoint;
    }
    searchAccesspoint(province?: string, text?: string, page?: number, limit?: number) {
        return this.getHttpService().requestAccesspoint(province, null, text, null, null, null, page, limit);
    }
    /**================================================== */

    onLoading() {
        return Promise.all([this.getBandwidths(),
        this.getFirmwares(),
        this.getProvinces(),
        this.getTemplateLogins()]);
    }

    onUpdate() {
        if (this.mLocationBaseAccesspoint) this.mLocationBaseAccesspoint.onUpdate();
        if (this.mListBaseAccesspoint) this.mListBaseAccesspoint.onUpdate();
    }

}


