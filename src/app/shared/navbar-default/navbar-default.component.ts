import {Component, OnInit} from "@angular/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";
import {AuthAppService} from "../../auth/services/auth-app.service";

@Component({
  selector: 'app-navbar-default',
  templateUrl: './navbar-default.component.html',
  styleUrls: ['./navbar-default.component.css']
})
export class NavbarDefaultComponent implements OnInit{
  currentLang: string;
  isNavbarCollapsed: boolean = true;
  isLoggedIn: boolean = false;

  constructor(private languageTranslateService: LanguageTranslateService,
              private authAppService: AuthAppService) {
    languageTranslateService.currentLang.subscribe((value) => {
      this.currentLang = value;
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authAppService.isLoggedIn();
  }
}
