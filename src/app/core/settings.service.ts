import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../app.config";
import {Headers, RequestOptions, Response, Http} from "@angular/http";
import {AuthAppService} from "../auth/services/auth-app.service";
import {LanguageTranslateService} from "../shared/language-translate.service";

@Injectable()
export class SettingsService {
  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});
  theme: BehaviorSubject<string> = new BehaviorSubject<string>("default");

  constructor(private cookieService: CookieService,
              private authHttp: AuthHttp,
              private http: Http,
              private config: AppConfig,
              private authService: AuthAppService,
              private languageService: LanguageTranslateService) {
  }

  getTheme(){
    if (typeof this.cookieService.get("theme") !== "undefined") {
      this.theme.next(this.cookieService.get("theme"));
    }
    else if (typeof this.cookieService.get("theme") === "undefined" && this.authService.isLoggedIn()) {
      this.getThemeRequest().subscribe(
        (data) => {
          if (data.theme != null) {
            this.cookieService.put("theme", data.theme);
            this.theme.next(data.theme);
          }
        }
      );
    }
    else {
      this.theme.next("default");
    }

  }

  setTheme(theme: string) {
    return this.authHttp.post(this.config.getConfig('api') + `/user-settings`, {"theme": theme}, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
          if (res.code === 200) {
            this.cookieService.put("theme", theme);
            this.theme.next(theme);
            return res.data;
          }
          else {
            return Observable.throw(res.data || 'Server error')
          }
        }
      )
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getThemeRequest() {
    return this.authHttp.get(this.config.getConfig('api') + `/user-settings`, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
      console.log("request executed");
          if (res.code === 200) {
            return res.data;
          }
          else {
            this.theme.next("default");
            this.cookieService.put("theme", "default");
            return Observable.throw(res.data || 'Server error')
          }
        }
      )
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  changePassword(passwordChange: any) {
    const passwordChangeObj = passwordChange;
    passwordChangeObj.lang = this.languageService.getCurrentLanguage();
    return this.authHttp.post(this.config.getConfig('api') + `/change-password`, passwordChangeObj, this.options)
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
