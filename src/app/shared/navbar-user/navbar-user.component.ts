import {Component} from "@angular/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['navbar-user.component.scss']
})
export class NavbarUserComponent {
  currentLang: string;
  isNavbarCollapsed: boolean = true;

  constructor(private languageTanslateService: LanguageTranslateService) {
    languageTanslateService.currentLang.subscribe((value) => {
      this.currentLang = value;
    });
  }

}
