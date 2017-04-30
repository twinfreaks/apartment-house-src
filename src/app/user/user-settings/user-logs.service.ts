import {Injectable} from '@angular/core';
import {Headers, RequestOptions, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../../app.config";
import {Observable} from "rxjs";

@Injectable()
export class UserLogsService {

  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private authHttp: AuthHttp,
              private config: AppConfig) {
  }

  getAllLogs() {
    return this.authHttp.get(this.config.getConfig('api') + `/user-logs`, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code === 200) {
            return res.data;
          }
          else {
            return Observable.throw(res.data || 'Server error')
          }
        }
      )
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
