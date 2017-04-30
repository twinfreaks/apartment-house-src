import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UserCalculationComponent} from "./user-calculation/user-calculation.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {TranslateModule} from "@ngx-translate/core";
import {SelectModule} from "ng2-select";
import {ScrollToTopComponent} from "app/shared/scroll-to-top/scroll-to-top.component";
import {UserRequestModule} from "../user-request/user-request.module";

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    SelectModule,
    InfiniteScrollModule,
    UserRequestModule
  ],
  declarations: [UserCalculationComponent, ScrollToTopComponent],
  providers: [AuthAppService]
})
export class CalculationsModule {
}
