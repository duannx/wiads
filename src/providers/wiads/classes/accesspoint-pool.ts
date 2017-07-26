import { AccessPoint } from './accesspoint';

export class AccesspointPool {

    mFreeItems: Array<AccessPoint> = [];

    private mUniqueIndex: number = 0;

    constructor() {
        this.create(1000);
    }

    create(size: number) {
        while (this.mFreeItems.length < size) {
            let accespoint = new AccessPoint();
            accespoint.setIndex(this.mUniqueIndex++);
            this.mFreeItems.push(accespoint);
        }
    }

    obtain(): AccessPoint {
        if (this.mFreeItems.length == 0) {
            let accespoint = new AccessPoint();
            accespoint.setIndex(this.mUniqueIndex++);
            this.mFreeItems.push(accespoint);
        }

        return this.mFreeItems.pop();
    }

    free(item: AccessPoint) {
        item.reset();
        this.mFreeItems.push(item);
    }
}