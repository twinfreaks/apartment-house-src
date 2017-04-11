import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "app/app.config";
import {Observable} from "rxjs";
import {CalculationType} from "app/shared/models/calculation-type.model";
import {Calculation} from "app/shared/models/calculation.model";
import {Building} from "app/shared/models/building.model";

@Injectable()
export class CalculationService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});
  private calculationUrl = this.config.getConfig('api') + `/calculations`;
  private calculationTypeUrl = this.config.getConfig('api') + `/calculation-types`;

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private config: AppConfig) {
  }

  getAllTypes(): Observable<CalculationType[]> {
    return this.http.get(this.calculationTypeUrl)
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

  getRelevantTypes(): Observable<CalculationType[]> {
    return this.http.get(`${this.calculationTypeUrl}?forAdmin=true`)
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

  postType(type: CalculationType) {
    return this.http.post(this.calculationTypeUrl, type, this.options)
      .map((resp: Response) => resp.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw(res.json() || 'Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  editType(type: CalculationType) {
    return this.http.put(`${this.calculationTypeUrl}/${type.id}`, type, this.options)
      .map((resp: Response) => resp.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw(res.json() || 'Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  postCalculationsArray(calculations: Calculation[]) {
    return this.http.post(`${this.calculationUrl}?array=true`, calculations, this.options)
      .map((resp: Response) => resp.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw('Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  postCalculation(calculation: Calculation) {
    return this.http.post(this.calculationUrl, calculation, this.options)
      .map((resp: Response) => resp.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw(res.json() || 'Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  editCalculation(calculation: Calculation) {
    return this.http.put(`${this.calculationUrl}/${calculation.id}`, calculation, this.options)
      .map((resp: Response) => resp.json())
      .map((res) => {
          if (res.code == 200) {
            return res.data;
          }
          return Observable.throw('Server error')
        }
      )
      .catch((error: any) => Observable.throw(error || "server error"));
  }

  getInhabitantsDebts(building: Building, calculationType: CalculationType) {
    return this.http.get(`${this.calculationTypeUrl}/${calculationType.id}/inhabitants-debts?building=${building.id}`)
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

    getInhabitantCalculations(id: number, page: number, type: any){
      return this.http.get(`${this.calculationUrl}?inhabitant=${id}&page=${page}&type=${type}`)
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

    deleteCalculationType(type){
      return this.http.delete(`${this.calculationTypeUrl}/${type.id}`, this.options)
        .map((resp: Response) => resp.json())
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
