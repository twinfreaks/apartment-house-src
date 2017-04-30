import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class ViberService {

  private viberUrl = this.config.getConfig('api') + `/viber`;

  constructor(private http: AuthHttp,
              private config: AppConfig) {
  }

  getPAInfo() {
    return this.http.get(this.viberUrl)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  sendMessages(text: string) {
    const messageText = `?text=${text}`;
    return this.http.put(this.viberUrl + messageText, {})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      })
  }
}
