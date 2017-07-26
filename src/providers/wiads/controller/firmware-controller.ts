import { AccesspointFirmware } from '../classes/firmware';

import { ResponseCode } from '../../app-constant';

export class FirmwareController {

    mItems: Array<AccesspointFirmware> = [];

    constructor() {

    }
    ready() {
        return this.mItems.length > 0;
    }

    onResponseData(data) {
        if (data && data.code == ResponseCode.SUCCESS) {
            this.mItems = [];
            for (let itemData of data.data) {
                let item = new AccesspointFirmware();
                item.onResponseData(itemData);
                this.mItems.push(item);
            }
        }
    }
    
    getItems() {
        return this.mItems;
    }
}