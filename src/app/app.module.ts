import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, Http} from "@angular/http";
import {NgModule, APP_INITIALIZER} from "@angular/core";
import {ModalModule} from "ngx-bootstrap/modal";
import {AlertModule} from "ngx-bootstrap/alert";
import {AppConfig} from "./app.config";
import {AuthModule} from "app/auth/auth.module";
import {CoreModule} from "app/core/core.module";
import {RoutingModule} from "./routing/routing.module";
import {SharedModule} from "app/shared/shared.module";
import {AppComponent} from "./app.component";
import {AdminModule} from "app/admin/admin.module";
import {UserModule} from "app/user/user.module";
import {CustomFormsModule} from "ng2-validation";
import {LanguageTranslateService} from "app/shared/language-translate.service";
import {BlogHttpService} from "./shared/services/blog-http.service";
import {EventsHttpService} from "app/shared/services/events-http.service";
import {ToastrModule} from "ngx-toastr";
import {ProfileService} from "./shared/services/profile.service";
import {CookieModule} from "ngx-cookie";
import {BuildingService} from "app/shared/services/building.service";
import {ProtocolHttpService} from "./shared/services/protocol-http.service";
import {DashboardHttpService} from "./shared/services/dashboard-http.service";
import {CalculationService} from "./shared/services/calculation.service";
import {ViberService} from "./shared/services/viber-service";
import {RequestHttpService} from "./shared/services/request-http.service";
import {NgbTooltipModule, NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {GalleryHttpService} from "./shared/services/gallery-http.service";
import {CommentsHttpService} from './shared/services/comments-http.service';
import {BsDropdownModule, TabsModule} from "ngx-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateModule, TranslateService, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ProfanityHttpService} from "./shared/services/profanity-http.service";

export function initConfig(config: AppConfig) {
  return () => config.load();
}
export function translateLoader(http: Http) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (translateLoader),
        deps: [Http]
      }
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    HttpModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgbTooltipModule.forRoot(),
    NgbDropdownModule.forRoot(),
    NgbTooltipModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    RoutingModule,
    SharedModule,
    CoreModule,
    AuthModule,
    AdminModule,
    UserModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
    TranslateService,
    LanguageTranslateService,
    ProtocolHttpService,
    BlogHttpService,
    EventsHttpService,
    ProfileService,
    BuildingService,
    DashboardHttpService,
    CalculationService,
    ViberService,
    RequestHttpService,
    GalleryHttpService,
    CommentsHttpService,
    ProfanityHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
