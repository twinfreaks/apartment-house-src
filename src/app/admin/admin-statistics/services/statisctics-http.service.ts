import {Injectable} from "@angular/core";
import {Response, Headers, ResponseContentType} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "app/app.config";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class StatisticsHttpService {

    private statisticsUrl = this.config.getConfig('api') + `/statistics`;
    private excelExportUrl = this.config.getConfig('api') + `/excel-export`;

    constructor(private http: AuthHttp,
                private config: AppConfig) {
    }

    getStat(dateFrom: string, dateTo: string, type: string): Observable<any> {
      const url = `${this.statisticsUrl}?type=${type}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      return this.http
        .get(url)
        .map((resp: Response) => resp.json())
        .catch((error: any) => {
          return Observable.throw(error);
        });
    }

    getExcelExport(dateFrom: string, dateTo: string, subject: string, lang: string): Observable<any> {
        const url = `${this.excelExportUrl}?type=${subject}&dateFrom=${dateFrom}&dateTo=${dateTo}&lang=${lang}`;
        return this.http
          .get(url, { responseType: ResponseContentType.Blob })
          .map((resp: Response) => resp.blob())
          .catch((error: any) => {
              return Observable.throw(error);
          });
    }

}
