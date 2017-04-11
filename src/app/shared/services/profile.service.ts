import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {Inhabitant} from "../inhabitant.model";
import {Blog} from "../models/blog";

@Injectable()
export class ProfileService {
  private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
  private profileUrl = this.config.getConfig('api') + `/inhabitant`;

  constructor(private http: Http,
              private config: AppConfig) {
  }

  getProfileById(id: number): Observable<Inhabitant> {
    const url = `${this.profileUrl}/${id}`;
    return this.http.get(url)
      .map((resp: Response) => resp.json())
      .map((resp)=>{ return resp.data;})
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  putProfile(obj: Inhabitant): Observable<Inhabitant> {
    const url = `${this.profileUrl}/${obj.id}`,
          body = JSON.stringify(obj);
    return this.http.put(url, body, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  changePhoto(id: any, name: any): Observable<Inhabitant> {
    const url = `${this.profileUrl}/${id}`,
          data = {
            type: "changePhoto",
            photo: name
          };
    return this.http.put(url, data, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getUnreadedBlogsCount(id: number): Observable<Blog> {
    const type = '?type=unreadedBlogs',
          url = `${this.profileUrl}/${id}`;
    return this.http.get(url + type)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }
}