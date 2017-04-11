import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "app/shared/shared.module";
import {RoutingModule} from "app/routing/routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ConfirmDialogModule} from "primeng/primeng";
import { AlertModule } from "ng2-bootstrap/alert";
import {RequestsComponent} from "./requests/requests.component";
import {ManageRequestTypesComponent} from "./manage-request-types/manage-request-types.component";
import {AddEditTypeComponent} from "./add-edit-type/add-edit-type.component";
import {BsDropdownModule} from "ng2-bootstrap";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    NgbModule,
    BsDropdownModule,
    SharedModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    AlertModule.forRoot()
  ],
  declarations: [
    RequestsComponent,
    ManageRequestTypesComponent,
    AddEditTypeComponent
  ]
})
export class AdminRequestsModule {
}
