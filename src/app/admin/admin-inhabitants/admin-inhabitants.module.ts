import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {InhabitantsListComponent} from "./inhabitants-list/inhabitants-list.component";
import {TranslateModule} from "@ngx-translate/core";
import {TabsModule, ModalModule} from "ng2-bootstrap";
import {Ng2PaginationModule} from "ng2-pagination";
import {InhabitantsService} from "app/admin/admin-inhabitants/services/inhabitants.service";
import {MomentModule} from "angular2-moment";
import {ConfirmDialogModule} from "primeng/components/confirmdialog/confirmdialog";
import {ConfirmationService} from "primeng/components/common/api";
import {LanguageTranslateService} from "app/shared/language-translate.service";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {SelectModule} from "ng2-select";
import {InhabitantsTabsComponent} from "./inhabitants-tabs/inhabitants-tabs.component";
import {InhabitantActivateModalComponent} from "./inhabitant-activate-modal/inhabitant-activate-modal.component";
import {InhabitantDeleteModalComponent} from "./inhabitant-delete-modal/inhabitant-delete-modal.component";
import { InhabitantsListFilterComponent } from "./inhabitants-list-filter/inhabitants-list-filter.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InhabitantInactivateModalComponent} from "app/admin/admin-inhabitants/inhabitant-inactivate-modal/inhabitant-inactivate-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TabsModule,
    Ng2PaginationModule,
    MomentModule,
    ConfirmDialogModule,
    NgbTooltipModule,
    ModalModule,
    SelectModule
  ],
  declarations: [
    InhabitantsListComponent,
    InhabitantsTabsComponent,
    InhabitantActivateModalComponent,
    InhabitantInactivateModalComponent,
    InhabitantDeleteModalComponent,
    InhabitantsListFilterComponent
  ],
  providers: [
    InhabitantsService,
    ConfirmationService,
    LanguageTranslateService
  ]
})
export class AdminInhabitantsModule {
}
