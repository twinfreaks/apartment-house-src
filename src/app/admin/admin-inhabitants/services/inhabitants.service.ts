import {Injectable} from "@angular/core";
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Inhabitant} from "app/admin/admin-inhabitants/models/inhabitant.model";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "app/app.config";
import {SearchInhabitants} from "app/admin/admin-inhabitants/models/search-inhabitants.model";

@Injectable()
export class InhabitantsService {
  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private config: AppConfig) {
  }

  getAll(searchInhabitants?: SearchInhabitants): Observable<Inhabitant[]> {
    let searchQuery = '';
    if (typeof searchInhabitants !== 'undefined') {
      searchQuery = '?'+this.formQueryString(searchInhabitants) + "&type=filter";
    }

    return this.authHttp.get(this.config.getConfig('api') + `/inhabitant` + searchQuery, this.options)
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

  getInhabitantsCounter(): Observable<number> {
    return this.authHttp.get(this.config.getConfig('api') + `/inhabitant?type=count`, this.options)
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

  setInActive(inhabitantId: number, lang: string): Observable<Inhabitant> {
    const data = {
      inhabitantId: inhabitantId,
      lang: lang,
      type: 'setInActive'
    };
    return this.authHttp.put(this.config.getConfig('api') + `/inhabitant/${inhabitantId}`, data, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  setActive(inhabitantId: number, lang: string): Observable<Inhabitant> {
    const data = {
      inhabitantId: inhabitantId,
      lang: lang,
      type: 'setActive'
    };
    return this.authHttp.put(this.config.getConfig('api') + `/inhabitant/${inhabitantId}`, data, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  removeInhabitant(inhabitantId: number, lang: string): Observable<Inhabitant> {
    const data = {
      inhabitantId: inhabitantId,
      lang: lang,
      type: 'setDeleted'
    };
    return this.authHttp.put(this.config.getConfig('api') + `/inhabitant/${inhabitantId}`, data, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  private formQueryString(queryObject) {
    return Object.keys(queryObject).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(queryObject[k])
    }).join('&');
  }
}
