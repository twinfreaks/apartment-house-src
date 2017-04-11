import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Subject, BehaviorSubject} from "rxjs";
import * as moment from "moment/moment";
import "moment/min/locales";
import {CookieService} from "ngx-cookie";

@Injectable()
export class LanguageTranslateService {

  private languages: any;
  private currentLanguage;
  public currentLang: Subject<string> = new BehaviorSubject<string>(null);

  constructor(private translate: TranslateService,
              private cookie: CookieService) {
    translate.addLangs(["en", "uk"]);
    this.languages = translate.getLangs();
    this.setDefaultBrowserLang();
  }

  public setDefaultBrowserLang(): void {
    if (typeof this.translate.currentLang === 'undefined' && typeof this.cookie.get("language") === 'undefined') {
      let browserLang: string = this.translate.getBrowserLang();
      this.translate.use(browserLang.match(/en|uk/) ? browserLang : 'uk');
      this.currentLang.next(this.translate.currentLang);
      this.setCurrentLanguage(this.translate.currentLang);
      moment.locale(this.translate.currentLang);
    }
    else {
      this.setLanguage(this.cookie.get("language"));
    }
  }

  public setLanguage(lang: string): void {
    this.setCurrentLanguage(lang);
    this.translate.use(lang);
    moment.locale(lang);
    this.currentLang.next(lang);
  }

  public getLanguages() {
    return this.translate.getLangs();
  }

  public getCurrentLanguage() {
    return this.currentLanguage;
  }

  private setCurrentLanguage(lang) {
    this.cookie.put("language", lang);
    this.currentLanguage = lang;
  }

}
