import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {Protocol} from "../models/protocol";

@Injectable()
export class ProtocolHttpService {

  private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
  private protocolUrl = this.config.getConfig('api') + `/protocol`;

  constructor(private http: Http,
              private config: AppConfig) {
  }

  getProtocols(): Observable<[Protocol]> {
    return this.http.get(this.protocolUrl)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getProtocolById(id: number): Observable<Protocol> {
    const url = `${this.protocolUrl}/${id}`;
    return this.http.get(url)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  deleteProtocolById(id: number): Observable<Protocol> {
    const url = `${this.protocolUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  updateProtocol(obj: Protocol): Observable<Protocol> {
    const url = `${this.protocolUrl}/${obj.id}`,
      type = `?type=update`,
      body = JSON.stringify(obj);
    return this.http.put(url + type, body, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  setIsActive(obj: Protocol): Observable<Protocol> {
    const url = `${this.protocolUrl}/${obj.id}`,
      type = `?type=isActive`,
      body = JSON.stringify(obj);
    return this.http.put(url + type, body, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  postProtocol(obj: Protocol): Observable<Protocol> {
    const body = JSON.stringify(obj);
    return this.http.post(this.protocolUrl, body, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }
}
