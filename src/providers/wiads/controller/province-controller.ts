import { Province } from '../classes/province';

import { ResponseCode } from '../../app-constant';

export class ProvinceController {

    mItems: Array<Province> = [];

    constructor() {

    }
    ready() {
        return this.mItems.length > 0;
    }

    onResponseData(data) {
        if (data && data.code == ResponseCode.SUCCESS) {
            this.mItems = [];
            for (let itemData of data.data) {
                let item = new Province();
                item.onResponseData(itemData);
                this.mItems.push(item);
            }
        }
    }
    
    getItems() {
        return this.mItems;
    }
}