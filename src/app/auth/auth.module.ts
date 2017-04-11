import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {InputMaskModule} from "primeng/primeng";
import {AuthGuardService} from "app/auth/services/auth-guard.service";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {Http, RequestOptions} from "@angular/http";
import {RoutingModule} from "app/routing/routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "app/shared/shared.module";
import {SelectModule} from "ng2-select";
import {AuthLoginPageComponent} from "app/auth/auth-login-page/auth-login-page.component";
import {ProfileRegistrationPageComponent} from "app/auth/profile-registration-page/profile-registration-page.component";
import {OauthModule} from "app/oauth/oauth.module";
import {CoreModule} from "app/core/core.module";
import {PswdRestorePageComponent} from "./password-restore/pswd-restore-page/pswd-restore-page.component";
import {PswdRestoreEmailPartialComponent} from "./password-restore/pswd-restore-email-partial/pswd-restore-email-partial.component";
import {PswdRestorePhonePartialComponent} from "./password-restore/pswd-restore-phone-partial/pswd-restore-phone-partial.component";
import {PswdRestoreChooseComponent} from "./password-restore/pswd-restore-choose/pswd-restore-choose.component";
import {PswdRestoreComponent} from "./password-restore/pswd-restore/pswd-restore.component";
import {PswdEmailsentPartialComponent} from "./password-restore/pswd-emailsent-partial/pswd-emailsent-partial.component";
import {PswdPhonesentPartialComponent} from "./password-restore/pswd-phonesent-partial/pswd-phonesent-partial.component";
import {ReCaptchaModule} from "angular2-recaptcha";
import {RestorePasswordService} from "app/auth/services/restore-password.service";
import {PswdRestoreResultPageComponent} from "./password-restore/pswd-restore-result-page/pswd-restore-result-page.component";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RoutingModule,
    SharedModule,
    OauthModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    InputMaskModule,
    ReCaptchaModule
  ],
  exports: [
    AuthLoginPageComponent
  ],
  declarations: [
    AuthLoginPageComponent,
    ProfileRegistrationPageComponent,
    PswdRestorePageComponent,
    PswdRestoreEmailPartialComponent,
    PswdRestorePhonePartialComponent,
    PswdRestoreChooseComponent,
    PswdRestoreComponent,
    PswdEmailsentPartialComponent,
    PswdPhonesentPartialComponent,
    PswdRestoreResultPageComponent
  ],
  providers: [
    AuthGuardService,
    RestorePasswordService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule {
}
