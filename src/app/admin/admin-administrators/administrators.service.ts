import {Injectable} from '@angular/core';
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../../app.config";
import {Observable} from "rxjs";
import {Administrator} from "./administrator.model";

@Injectable()
export class AdministratorsService {
  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private config: AppConfig) {
  }

  getAll(): Observable<Administrator[]> {
    return this.authHttp.get(this.config.getConfig('api') + `/administrators`, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code === 200) {
            return res.data;
          }
          else {
            return Observable.throw(res.data || 'Server error')
          }
        }
      ).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  get(id: number): Observable<Administrator[]> {
    return this.authHttp.get(this.config.getConfig('api') + `/administrators/${id}`, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code === 200) {
            return res.data;
          }
          else {
            return Observable.throw(res.data || 'Server error')
          }
        }
      ).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  remove(administratorId: number): Observable<Response> {
    return this.authHttp.delete(this.config.getConfig('api')+`/administrators/${administratorId}`, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          else {
            return Observable.throw(res.json() || 'Server error')
          }
        }
      ).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  save(administrator: Administrator): Observable<Response> {
    return this.authHttp.post(this.config.getConfig('api')+`/administrators`, administrator, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code === 200) {
            return res.data;
          }
          else {
            return Observable.throw(res.json() || 'Server error')
          }
        }
      ).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  update(administrator: Administrator, id: number): Observable<Response> {
    return this.authHttp.put(this.config.getConfig('api')+`/administrators/${id}`, administrator, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code === 200) {
            return res.data;
          }
          else {
            return Observable.throw(res.json() || 'Server error')
          }
        }
      ).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}