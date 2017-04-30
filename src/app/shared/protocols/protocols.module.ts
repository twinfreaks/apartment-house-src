import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ModalModule} from "ngx-bootstrap";
import {RoutingModule} from "../../routing/routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {FileUploadModule} from "primeng/components/fileupload/fileupload";
import {ViberModule} from "../../admin/viber/viber.module";
import {ProtocolsComponent} from "./protocols.component";
import {PdfViewerComponent} from "ng2-pdf-viewer";
import {UserRequestModule} from "../../user/user-request/user-request.module";
import {DashboardModalComponent} from "../../user/dashboard/dashboard-modal/dashboard-modal.component";
import {SharedModule} from "../shared.module";

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    RoutingModule,
    TranslateModule,
    FormsModule,
    ViberModule,
    FileUploadModule,
    UserRequestModule,
    SharedModule
  ],
  exports: [
    ProtocolsComponent,
    DashboardModalComponent,
    PdfViewerComponent
  ],
  declarations: [
    ProtocolsComponent,
    DashboardModalComponent,
    PdfViewerComponent
  ]
})
export class ProtocolsModule {
}
