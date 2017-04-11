import {Injectable} from "@angular/core";
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {AppConfig} from "app/app.config";
import {Observable} from "rxjs";
import {RestoreByEmail} from "app/auth/restore-by-email.model";
import {RestoreByPhone} from "app/auth/restore-by-phone.model";
import {UserChangePassword} from "app/auth/user-change-password.model";

@Injectable()
export class RestorePasswordService {

  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private http: Http,
              private config: AppConfig) {
  }

  restoreByEmail(restoreByEmail: RestoreByEmail): Observable<Response> {
    return this.http.post(this.config.getConfig('api') + `/restore-password`, restoreByEmail, this.options)
        .map((res: Response) => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  restoreByPhone(restoreByPhone: RestoreByPhone): Observable<Response> {
    return this.http.post(this.config.getConfig('api') + `/restore-password`, restoreByPhone, this.options)
        .map((res: Response) => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkCode(code: string): Observable<Response> {
    const checkCodeData = {
      code: code,
      type: "checkCode"
    };
    return this.http.post(this.config.getConfig('api') + `/restore-password`, checkCodeData, this.options)
        .map((res: Response) => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  changePassword(userData: UserChangePassword): Observable<Response> {
    const userDataChPassword = userData;
    userDataChPassword["type"] = "restorePassword";
    return this.http.post(this.config.getConfig('api') + `/restore-password`, userDataChPassword, this.options)
        .map((res: Response) => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
