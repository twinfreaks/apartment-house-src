import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {RequestType} from "../models/request-type.model";
import {Request} from "../models/request.model";

@Injectable()
export class RequestHttpService {

    private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
    private requestsUrl = this.config.getConfig('api') + `/requests`;
    private requestsTypeUrl = this.config.getConfig('api') + `/requests-type`;

    constructor(private http: Http,
                private config: AppConfig) {
    }

    getType(id: number): Observable<RequestType> {
        const url = `${this.requestsTypeUrl}/${id}`;
        return this.http
            .get(url)
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    sendRequesttype(req: RequestType): Observable<RequestType> {
        let body = JSON.stringify(req);
        return this.http
            .post(this.requestsTypeUrl, body, {headers: this.headers})
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    updateRequestType(obj: RequestType): Observable<RequestType> {
        const url = `${this.requestsTypeUrl}/${obj.id}`,
            body = JSON.stringify(obj);
        return this.http
            .put(url, body, {headers: this.headers})
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    deleteType(id: number): Observable<any> {
        const url = `${this.requestsTypeUrl}/${id}`;
        return this.http
            .delete(url, {headers: this.headers})
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getTypes(): Observable<RequestType> {
    return this.http
      .get(this.requestsTypeUrl)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
          return Observable.throw(error);
      });
}

    getAllRequests(): Observable<[Request]> {
        return this.http
            .get(this.requestsUrl)
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getCountOfNotDoneRequests(): Observable<number> {
        const url = `${this.requestsUrl}?countNotDone`;
        return this.http
          .get(url)
          .map((resp: Response) => resp.json())
          .catch((error: any) => {
              return Observable.throw(error);
          });
    }

    sendRequest(req: any): Observable<Request> {
        let body = JSON.stringify(req);
        return this.http
            .post(this.requestsUrl, body, {headers: this.headers})
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    updateRequeast(obj: any): Observable<any> {
        const url = `${this.requestsUrl}/${obj.id}`,
            body = JSON.stringify(obj);
        return this.http
            .put(url, body, {headers: this.headers})
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    deleteRequestes(requestTypeId: number): Observable<any> {
        const url = `${this.requestsUrl}?requestType=${requestTypeId}`;
        return this.http
            .delete(url, {headers: this.headers})
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
}
