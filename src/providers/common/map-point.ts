import { Utils } from '../app-utils';
export class MapPoint {
    lat: number = 0;
    lng: number = 0;

    constructor() {

    }

    isValid() {
        return this.lat != 0 && this.lng != 0;
    }
    set(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    getDistanceInKm(lat: number, lng: number) : number {
        return Utils.calculateDistance(this.lat, this.lng, lat, lng);
    }

    getDistanceMapPoint(point: MapPoint) : number{
        return Utils.calculateDistance(this.lat, this.lng, point.lat, point.lng);
    }
}