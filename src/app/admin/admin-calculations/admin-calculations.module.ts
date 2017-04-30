import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AdminCalculationsRootComponent} from "./admin-calculations-root/admin-calculations-root.component";
import {AdminChooseBuildingComponent} from "./admin-choose-building/admin-choose-building.component";
import {AdminChooseCalculationTypeComponent} from "./admin-choose-calculation-type/admin-choose-calculation-type.component";
import {AdminAddCalculationsComponent} from "./admin-add-calculations/admin-add-calculations.component";
import {TranslateModule} from "@ngx-translate/core";
import {SelectModule} from "ng2-select";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {FileUploadModule} from "primeng/primeng";
import {ConfirmDialogModule, ConfirmationService} from "primeng/primeng";
import {AddEditBuildingComponent} from "./add-edit-building/add-edit-building.component";
import {AddEditCalculationTypeComponent} from "./add-edit-calculation-type/add-edit-calculation-type.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SelectModule,
    FileUploadModule,
    ConfirmDialogModule,
    TooltipModule.forRoot()
  ],
  exports: [AdminCalculationsRootComponent],
  declarations: [AdminCalculationsRootComponent,
    AdminChooseBuildingComponent,
    AdminChooseCalculationTypeComponent,
    AdminAddCalculationsComponent,
    AddEditBuildingComponent,
    AddEditCalculationTypeComponent],
  providers: [ConfirmationService]
})
export class AdminCalculationsModule {
}
