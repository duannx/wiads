export class AccessPoint {
    mIndex: number = -1;
    mMacAddress: string = "";
    mID: number = -1;
    mName: string = "";
    mProvince: string = "";
    mSSID: string = "";
    mKey: string = "";
    mLat: number = 0;
    mLng: number = 0;
    mCreateTime: string = "";
    mAddress: string = "";


    mOwner: string = "";
    mUsingKey: number = -1;
    mTrash: boolean = false;
    mMode: string = "";
    mBandwidthProfile: number = 0;
    mTemplateLogin: number = 0;
    mDetailUrl: number = 0;
    mFirmwareVersion: string = "";
    mLastTimeOnline: string = "";
    mDistance: string = "0 km";
    /**State : =0 online ; =1 : offline trong hom nay; =2 offline tu hom qua */
    mState: number = 0;
    constructor() {

    }
    reset() {
        this.mIndex = -1;
        this.mMacAddress = "";
        this.mID = -1;
        this.mName = "";
        this.mProvince = "";
        this.mSSID = "";
        this.mKey = "";
        this.mLat = 0;
        this.mLng = 0;
        this.mCreateTime = "";
        this.mAddress = "";


        this.mOwner = "";
        this.mUsingKey = -1;
        this.mTrash = false;
        this.mMode = "";
        this.mBandwidthProfile = 0;
        this.mTemplateLogin = 0;
        this.mDetailUrl = 0;
        this.mFirmwareVersion = "";
        this.mLastTimeOnline = "";
        this.mDistance = "0 km";
    }
    public setIndex(index: number) {
        this.mIndex = index;
    }
    /**Du lieu tra ve khi lay theo list */
    public onResponseData(data) {
        if (data) {
            this.mID = data.id;
            this.mMacAddress = data.macaddr;
            this.mName = data.name;
            this.mAddress = data.address;
            this.mProvince = data.province;
            this.mSSID = data.ssid;
            this.mKey = data.key;
            this.mLat = data.lat;
            this.mLng = data.lng;
            this.mCreateTime = data.created_at;
        }
    }

    /**Du lieu tra ve khi lay thong tin chi tiet */
    public onResponseDetail(data) {
        if (data) {
            this.mFirmwareVersion = data.fw_version;
            this.mLastTimeOnline = data.time;
            this.mKey = data.key;
            this.mName = data.name;
            this.mAddress = data.address;
            this.mProvince = data.province;
            this.mOwner = data.owner;
            this.mUsingKey = data.isUsingKey;
            this.mTrash = data.trash;
            this.mMode = data.mode;
            this.mBandwidthProfile = data.bw_profile;
            this.mTemplateLogin = data.login_template;
            this.mDetailUrl = data.detail_url;
        }
    }

    /**Du lieu tra ve khi lay theo location */
    public onResponseLocationData(data) {
        this.reset();
        if (data) {
            this.mID = data.id;
            this.mMacAddress = data.macaddr;
            this.mName = data.name;
            this.mAddress = data.address;
            this.mProvince = data.province;
            this.mSSID = data.ssid;
            this.mKey = data.key;
            this.mLat = data.lat;
            this.mLng = data.lng;
            this.mCreateTime = data.created_at;
            this.mDistance = data.distance;
        }
    }


    public getMacAddress() {
        return this.mMacAddress;
    }

    public setMacAddress(macAddress: string) {
        this.mMacAddress = macAddress;
    }

    public getState(): number {
        return this.mState;
    }

    public pair(accesspoint: AccessPoint) {
        for (let key in accesspoint) {
            this[key] = accesspoint[key];
        }
    }
}