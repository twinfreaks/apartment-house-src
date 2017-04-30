import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";
import {Building} from "../../shared/models/building.model";
import {AppConfig} from "../../app.config";

@Injectable()
export class BuildingsRegistrationService {

  constructor(private http: Http,
              private config: AppConfig) { }

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

}
