import { AccesspointController } from './accesspoint-controller';
import { AccesspointPool } from '../classes/accesspoint-pool';
import { AccessPoint } from '../classes/accesspoint';
import { MapPoint } from '../../common/map-point';
import { WiadsHttpService } from '../wiads-http-service';
import { RequestState } from '../../app-constant';



export class ListAccesspointController extends AccesspointController {

    mDataChangeListener: any;
    mLoadMoreListener: any;

    mHttpService: WiadsHttpService;

    mRequestState: RequestState = RequestState.READY;

    private mRunning: boolean = false;

    private mTime: number = 0;

    private mRequestStep: number = 100;

    private mObjectPool: AccesspointPool;

    mRequest = {
        province: "",
        page: 1,
        pages: 1,
        limit: 20,
        fromDate: "",
        toDate: ""
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
        if (this.mRequest.page <= this.mRequest.pages) {
            this.mRequestState = RequestState.REQUESTING;
            this.mHttpService.requestAccesspointList(this.mRequest.page, this.mRequest.limit, this.mRequest.province, this.mRequest.fromDate, this.mRequest.toDate).then(
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
            if (data.code == 1) {
                let returnDatas = [];
                this.mRequest.page = parseInt(data.page_info.current) + 1;
                this.mRequest.pages = data.page_info.total;
                if (data.data) {
                    for (let itemData of data.data) {
                        let item = this.mObjectPool.obtain();
                        item.onResponseData(itemData);
                        this.mItems.push(item);
                        returnDatas.push(item);
                    }
                }

                if (this.mDataChangeListener) this.mDataChangeListener(this.mItems);

                if (this.mLoadMoreListener) {
                    this.mLoadMoreListener(returnDatas);
                    this.mLoadMoreListener = null;
                }
            }


        }
    }

    /**
     * Listener truyền vào chỉ đơn giản là 1 function; locationBase.setOnChangeListener(()=>{});
     * Mỗi khi có sự thay đổi về dữ liệu, listener này sẽ notify 1 event để có thể handle dữ liệu */
    setOnChangeListener(listener) {
        this.mDataChangeListener = listener;
    }

    /**Cap nhat request parameters */
    setRequestProvince(province: string) {
        this.mRequest.province = province;
        this.onRequestParamsChange();
    }

    setRequestDate(fromDate: string, toDate: string) {
        this.mRequest.fromDate = fromDate;
        this.mRequest.toDate = toDate;
        this.onRequestParamsChange();
    }



    onRequestParamsChange() {
        this.mRequest.page = 1;
        this.mRequest.pages = 1;
        while (this.mItems.length > 0) {
            let item = this.mItems.pop();
            this.mObjectPool.free(item);
        }
        this.doCheckRequestData();
    }

    /**
     * 
     * @param state 
     * = 0 : online
     * = 1 : offline trong hom nay.
     * = 2 : offline tu hom qua
     */
    getAccesspointByState(state: number): Array<AccessPoint> {
        let datas: Array<AccessPoint> = [];
        for (let item of this.mItems) {
            if (item.getState() == state) datas.push(item);
        }
        return datas;
    }

    doReset() {
        this.onRequestParamsChange();
    }

    doLoadMore(listener) {
        this.mLoadMoreListener = listener;
        this.doCheckRequestData();
    }
}