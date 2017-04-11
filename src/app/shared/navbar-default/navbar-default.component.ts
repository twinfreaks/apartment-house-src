import {Component} from "@angular/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-navbar-default',
  templateUrl: './navbar-default.component.html',
  styleUrls: ['./navbar-default.component.css']
})
export class NavbarDefaultComponent {
  currentLang: string;
  isNavbarCollapsed: boolean = true;

  constructor(private languageTanslateService: LanguageTranslateService) {
    languageTanslateService.currentLang.subscribe((value) => {
      this.currentLang = value;
    });
  }

}
