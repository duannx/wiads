export class WiadsAccessToken {
    mAccessToken: string = "";
    mExpiredIn: number = 0;
    mCreatedTime: number = 0;
    mType: string = "";
    mScope: string = "";
    mRefreshToken: string = "";

    constructor() {
        this.mCreatedTime = Date.now();
    }

    public onResponseToken(data) {
        if (!data || data.code != 1 || !data.data) return;
        let tokenData = data.data;
        if (tokenData.access_token) this.mAccessToken = tokenData.access_token;
        if (tokenData.expires_in) this.mExpiredIn = tokenData.expires_in;
        if (tokenData.token_type) this.mType = tokenData.token_type;
        if (tokenData.scope) this.mScope = tokenData.scope;
        if (tokenData.refresh_token) this.mRefreshToken = tokenData.refresh_token;
        this.mCreatedTime = Date.now();
    }

    /**Trả về đối tượng token để lưu trữ ở bộ nhớ */
    public getTokenData() {
        return {
            "mAccessToken": this.mAccessToken,
            "mExpiredIn": this.mExpiredIn,
            "mCreatedTime": this.mCreatedTime,
            "mType": this.mType,
            "mScope": this.mScope,
            "mRefreshToken": this.mRefreshToken
        };
    }
    public isValidTokenData(data): boolean {
        if (!data) return false;
        let time = data.mCreatedTime + data.mExpiredIn * 1000;
        let dt = Date.now() - time;
        if (dt > 0) return false;
        return true;
    }
    public onValidTokenData(data) {
        if (!data) return;
        this.mAccessToken = data.mAccessToken;
        this.mExpiredIn = data.mExpiredIn;
        this.mCreatedTime = data.mCreatedTime;
        this.mType = data.mType;
        this.mScope = data.mScope;
        this.mRefreshToken = data.mRefreshToken;
    }
    public hasToken(): boolean {
        return this.mAccessToken.length > 0;
    }
}