import {Component} from "@angular/core";
import {LanguageTranslateService} from "../language-translate.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-langs',
  template: `<span>
                <span (click)="setLanguage(lang)" *ngFor="let lang of languages">
                    <img height="35" class="flag"  [ngClass]="{'active': currentLang == lang}"  [src]="['/assets/img/'+lang+'.png']" />
                </span>
            </span>`,
  styles: [`.flag {
            opacity: 0.8;
            cursor: pointer;
          }
          
          .flag.active, .flag:hover {
            opacity: 1.0
          }`]
})
export class LangsComponent {

  languages: any;
  currentLang: string;

  constructor(private languageTanslateService: LanguageTranslateService,
              private router: Router) {
    this.languages = languageTanslateService.getLanguages();
    languageTanslateService.currentLang.subscribe((value) => {
      this.currentLang = value;
    });
  }

  setLanguage(lang) {
    this.router.navigate(['/']);
    return this.languageTanslateService.setLanguage(lang);
  }

}
