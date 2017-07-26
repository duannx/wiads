export class AccesspointFirmware {
    code: string = "Chưa xác định";
    name: string = "Chưa xác định";
    constructor() {

    }
    reset() {
        this.code = "Chưa xác định";
        this.name = "Chưa xác định";
    }
    onResponseData(data) {
        if (data) {
            this.code = data.code;
            this.name = data.name;
        }
    }

}