import {Component, OnInit} from "@angular/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";
import {AuthAppService} from "../../auth/services/auth-app.service";

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['navbar-admin.component.scss']
})
export class NavbarAdminComponent implements OnInit {
  currentLang: string;
  isNavbarCollapsed: boolean = true;
  role: string;

  constructor(private languageTanslateService: LanguageTranslateService,
              private authAppService: AuthAppService
  ) {
    languageTanslateService.currentLang.subscribe((value) => {
      this.currentLang = value;
    });
  }

  ngOnInit() {
    this.role = this.authAppService.getRoles()[0];
  }
}