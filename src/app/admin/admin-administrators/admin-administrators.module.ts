import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AdministratorsListComponent} from "./administrators-list/administrators-list.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {AdministratorsService} from "./administrators.service";
import {AdministratorDeleteModalComponent} from "./administrator-delete-modal/administrator-delete-modal.component";
import {ModalModule} from "ngx-bootstrap";
import {AdministratorEditComponent} from "./administrator-edit/administrator-edit.component";
import {RoutingModule} from "../../routing/routing.module";
import {CoreModule} from "../../core/core.module";
import {SelectModule} from "ng2-select";
import {RolesService} from "./roles.service";

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxPaginationModule,
    SelectModule,
    TranslateModule,
    NgbTooltipModule,
    ModalModule,
    RoutingModule
  ],
  providers: [
    AdministratorsService,
    RolesService
  ],
  declarations: [
    AdministratorsListComponent,
    AdministratorDeleteModalComponent,
    AdministratorEditComponent
  ]
})
export class AdminAdministratorsModule {
}
