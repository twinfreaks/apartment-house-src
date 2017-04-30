import {Component, OnInit} from "@angular/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";
import {SettingsService} from "./core/settings.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  theme: string;
  constructor(public translate: LanguageTranslateService,
              private settingsService: SettingsService) {
     this.settingsService.theme.subscribe((theme) => this.theme = theme);
  }

  ngOnInit() {
    this.settingsService.getTheme();
  }
}
