import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {Protocol} from "../models/protocol";
import {Blog} from "../models/blog";
import {DashboardConfig} from "../../user/dashboard/dashboard-config";
import {CalendarEvent} from "../models/calendar-event";
import {Calculation} from "../models/calculation.model";
// import Any = jasmine.Any;

@Injectable()
export class DashboardHttpService {

  private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
  private dashboardUrl = this.config.getConfig('api') + `/dashboard`;

  constructor(private http: Http,
              private config: AppConfig) {
  }

  getLastBlogs(limit: any): Observable<Blog> {
    const last = '?type=lastBlog';
    limit = `&limit=${limit}`;
    return this.http.get(this.dashboardUrl + last + limit)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getLastEvents(limit: any): Observable<CalendarEvent> {
    const last = '?type=lastEvent';
    limit = `&limit=${limit}`;
    return this.http.get(this.dashboardUrl + last + limit)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getLastProtocols(limit: any): Observable<Protocol> {
    const last = '?type=lastProtocol';
    limit = `&limit=${limit}`;
    return this.http.get(this.dashboardUrl + last + limit)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getLastCalculations(id: any): Observable<Calculation> {
    const last = '?type=lastCalculation';
    id = `&inhabitant=${id}`;
    return this.http.get(this.dashboardUrl + last + id)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getUnreadedBlogsCount(id: number): Observable<Blog> {
    const type = '?type=unreadedBlogs',
      url = `${this.dashboardUrl}/${id}`;
    return this.http.get(url + type)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getUnreadedEventsCount(id: number): Observable<CalendarEvent> {
    const type = '?type=unreadedEvents',
      url = `${this.dashboardUrl}/${id}`;
    return this.http.get(url + type)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getUnreadedProtocolsCount(id: number): Observable<Protocol> {
    const type = '?type=unreadedProtocols',
      url = `${this.dashboardUrl}/${id}`;
    return this.http.get(url + type)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getUnreadedCalculationsCount(id: number): Observable<Calculation> {
    const type = '?type=unreadedCalculations',
      url = `${this.dashboardUrl}/${id}`;
    return this.http.get(url + type)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  setStatusReaded(type: string, inhab: number, prot: number): Observable<Object> {
    const reqType = `?type=${type}`,
      reqInhab = `&inhab=${inhab}`,
      reqProt = `&thing=${prot}`;
    return this.http.post(this.dashboardUrl + reqType + reqInhab + reqProt, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  setUserConfig(config: DashboardConfig) {
    const body = JSON.stringify(config);
    return this.http.put(this.dashboardUrl, body, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getUserConfig(userID: string): Observable<DashboardConfig> {
    const type = '?type=getCfg',
      url = `${this.dashboardUrl}/${userID}`;
    return this.http.get(url + type)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }
}
