import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ModalModule} from "ng2-bootstrap";
import {RoutingModule} from "../../routing/routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {DragulaModule} from "ng2-dragula";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UserRequestModule} from "../user-request/user-request.module";
import {ProtocolsModule} from "../../shared/protocols/protocols.module";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    RoutingModule,
    TranslateModule,
    FormsModule,
    DragulaModule,
    UserRequestModule,
    ProtocolsModule,
    SharedModule,
  ],
  exports: [
    DashboardComponent,
  ],
  declarations: [
    DashboardComponent,
  ]
})
export class DashboardModule {
}
