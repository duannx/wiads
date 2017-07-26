import { AccesspointBandwidth } from '../classes/bandwidth';

import { ResponseCode } from '../../app-constant';

export class BandwidthController {

    mItems: Array<AccesspointBandwidth> = [];

    constructor() {

    }
    ready() {
        return this.mItems.length > 0;
    }

    onResponseData(data) {
        if (data && data.code == ResponseCode.SUCCESS) {
            this.mItems = [];
            for (let itemData of data.data) {
                let item = new AccesspointBandwidth();
                item.onResponseData(itemData);
                this.mItems.push(item);
            }
        }
    }

    getItems() {
        return this.mItems;
    }
    
    get(bwCode: number): AccesspointBandwidth {
        for (let bw of this.mItems) if (bwCode == bw.code) return bw;
        return null;
    }
}