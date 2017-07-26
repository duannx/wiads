import { TemplateLogin } from '../classes/template-login';

import { ResponseCode } from '../../app-constant';

export class TemplateLoginController {

    mItems: Array<TemplateLogin> = [];

    constructor() {

    }
    ready() {
        return this.mItems.length > 0;
    }

    onResponseData(data) {
        if (data && data.code == ResponseCode.SUCCESS) {
            this.mItems = [];
            for (let itemData of data.data) {
                let item = new TemplateLogin();
                item.onResponseData(itemData);
                this.mItems.push(item);
            }
        }
    }
    
    getItems() {
        return this.mItems;
    }
}