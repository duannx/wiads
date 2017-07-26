export class AccesspointBandwidth {
    code: number = -1;
    name: string = "Chưa xác định";

    constructor() {

    }

    public onResponseData(bwData: any) {
        if (bwData) {
            this.code = bwData.code;
            this.name = bwData.name;
        }
    }

}