import { AccessPoint } from '../classes/accesspoint';

import { ResponseCode } from '../../app-constant';

export class AccesspointController {

    public mItems: Array<AccessPoint> = [];

    constructor() {

    }
    public ready() {
        return this.mItems.length > 0;
    }

    public onResponseData(data) {
        if (data && data.code == ResponseCode.SUCCESS) {
            this.mItems = [];
            for (let itemData of data.data) {
                let item = new AccessPoint();
                item.onResponseData(itemData);
                this.mItems.push(item);
            }
        }
    }


    public get(macaddress: string, createIfNotExist?: boolean) {
        for (let item of this.mItems) {
            if (item.getMacAddress() == macaddress) {
                return item;
            }
        }

        if (createIfNotExist) {
            let accesspoint = new AccessPoint();
            accesspoint.setMacAddress(macaddress);
            this.mItems.push(accesspoint);
            return accesspoint;
        }

        return null;
    }



    public getItems() {
        return this.mItems;
    }


}