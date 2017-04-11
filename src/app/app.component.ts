import {Component} from "@angular/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public translate: LanguageTranslateService) {
  }
}
