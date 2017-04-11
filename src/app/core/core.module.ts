import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {UnauthorizedComponent} from "app/core/unauthorized/unauthorized.component";
import {TranslateModule} from "@ngx-translate/core";
import {ValidationMessagesComponent} from "./validation-messages/validation-messages.component";
import {ValidationService} from "app/core/validation-messages/validation.service";
import {RoutingModule} from "app/routing/routing.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RoutingModule
  ],
  exports: [
    PageNotFoundComponent,
    UnauthorizedComponent,
    ValidationMessagesComponent
  ],
  declarations: [
    PageNotFoundComponent,
    UnauthorizedComponent,
    ValidationMessagesComponent
  ],
  providers: [
    ValidationService
  ]
})
export class CoreModule {
}
