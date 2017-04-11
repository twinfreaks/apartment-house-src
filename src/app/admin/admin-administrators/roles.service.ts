import { Injectable } from '@angular/core';
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../../app.config";
import {Observable} from "rxjs";
import {Role} from "./role.model";

@Injectable()
export class RolesService {
  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private config: AppConfig) {
  }

  getAll(): Observable<Role[]> {
    return this.authHttp.get(this.config.getConfig('api') + `/roles`, this.options)
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
}