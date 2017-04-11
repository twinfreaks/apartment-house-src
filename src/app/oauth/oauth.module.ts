import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AuthOauthService} from "app/oauth/services/auth-oauth.service";
import {OauthCallbackComponent} from "app/oauth/oauth-callback/oauth-callback.component";
import {OauthButonsPartialComponent} from "./oauth-butons-partial/oauth-butons-partial.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    OauthCallbackComponent,
    OauthButonsPartialComponent
  ],
  declarations: [
    OauthCallbackComponent,
    OauthButonsPartialComponent
  ],
  providers: [
    AuthOauthService
  ]
})
export class OauthModule {
}
