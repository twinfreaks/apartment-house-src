import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "app/app.config";
import {Observable} from "rxjs";
import {Building} from "app/shared/models/building.model";

@Injectable()
export class BuildingService {

  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private http: AuthHttp,
              private authHttp: AuthHttp,
              private config: AppConfig) {
  }

  getAll(): Observable<Building[]> {
    return this.http.get(this.config.getConfig('api') + `/buildings`)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw(res.json() || 'Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  postBulding(building: Building) {
    return this.http.post(this.config.getConfig('api') + `/buildings`, building, this.options)
      .map((resp: Response) => resp.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw(res.json() || 'Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  getInhabitantsOfBuilding(building: Building) {
    return this.http.get(this.config.getConfig('api') + `/buildings/` + building.id + '/inhabitants')
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw(res.json() || 'Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  searchBuilding(street: string, building: string) {
    return this.http.get(this.config.getConfig('api') + `/search/buildings?street=${street}&building=${building}`)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw(res.json() || 'Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }
}
