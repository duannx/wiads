import { AccesspointController } from './accesspoint-controller';
import { AccesspointPool } from '../classes/accesspoint-pool';
import { MapPoint } from '../../common/map-point';
import { WiadsHttpService } from '../wiads-http-service';
import { RequestState } from '../../app-constant';



export class LocationBaseAccesspointController extends AccesspointController {

    mCurrentMapLocation: MapPoint = new MapPoint();

    mDataChangeListener: any;

    mHttpService: WiadsHttpService;

    mRequestState: RequestState = RequestState.READY;

    private mRunning: boolean = false;

    private mTime: number = 0;

    private mRequestStep: number = 100;

    private mMaxPage: number = 4;

    private mObjectPool: AccesspointPool;

    mRequest = {
        lat: 0,
        lng: 0,
        page: 1,
        pages: 1,
        limit: 20,
        radius: 3
    }
    constructor() {
        super();

    }

    onUpdate() {
        if (!this.mRunning) return;
        if (this.mRequestState == RequestState.READY) {
            {
                this.mTime++;
                if (this.mTime >= this.mRequestStep) {
                    this.doCheckRequestData();
                    this.mTime = 0;
                }
            }
        }

    }



    /** Set Http service */
    setHttpServiceProvider(httpService: WiadsHttpService) {
        this.mHttpService = httpService;
    }

    setObjectPool(pool: AccesspointPool) {
        this.mObjectPool = pool;
    }



    doCheckRequestData() {
        if (!this.mHttpService) return;
        if (this.mRequest.page <= this.mRequest.pages && this.mRequest.page <= this.mMaxPage) {
            this.mRequestState = RequestState.REQUESTING;
            this.mHttpService.requestAccesspointLocation(this.mRequest.lat, this.mRequest.lng, this.mRequest.page, this.mRequest.limit, this.mRequest.radius).then(
                data => {
                    this.onResponseAccesspoints(data);
                    this.mRequestState = RequestState.READY;
                },
                error => {
                    this.mRequestState = RequestState.READY;
                }
            );
        } else {
            this.mRunning = false;
        }
    }

    onResponseAccesspoints(data) {
        if (data) {
            let additionItems = []
            if (data.code == 1) {
                this.mRequest.page = parseInt(data.page_info.current) + 1;
                this.mRequest.pages = data.page_info.total;
                if (data.data) {
                    for (let itemData of data.data) {
                        let item = this.mObjectPool.obtain();
                        item.onResponseLocationData(itemData);
                        this.mItems.push(item);
                        additionItems.push(item);
                    }
                }
            }

            if (this.mDataChangeListener) this.mDataChangeListener(this.mItems, additionItems);
        }
    }
    /**
     * Listener truyền vào chỉ đơn giản là 1 function; locationBase.setOnChangeListener(()=>{});
     * Mỗi khi có sự thay đổi về dữ liệu, listener này sẽ notify 1 event để có thể handle dữ liệu */
    setOnChangeListener(listener) {
        this.mDataChangeListener = listener;
    }

    /**Hàm này dùng để cập nhật vị trí center của map, việc có cập nhật mới dữ liệu hay không cũng sẽ được cập nhật tự động */
    setCurrentMapLocation(lat: number, lng: number) {
        let needUpdate = true;
        if (this.mCurrentMapLocation.isValid()) {
            if (this.mCurrentMapLocation.getDistanceInKm(lat, lng) < 2) {
                needUpdate = false;
            }
        }
        if (needUpdate) {
            console.log("==========need update==========");

            this.mCurrentMapLocation.set(lat, lng);
            this.mRequest.lat = lat;
            this.mRequest.lng = lng;
            this.mRequest.page = 1;
            this.mRequest.pages = 1;
            while (this.mItems.length > 0) {
                let item = this.mItems.pop();
                this.mObjectPool.free(item);
            }
            this.mRunning = true;
            this.doCheckRequestData();
        }

    }



}