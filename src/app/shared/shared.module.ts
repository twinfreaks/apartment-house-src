import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarUserComponent} from './navbar-user/navbar-user.component';
import {NavbarAdminComponent} from './navbar-admin/navbar-admin.component';
import {RoutingModule} from "app/routing/routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {LangsComponent} from "app/shared/langs/langs.component";
import {NavbarDefaultComponent} from "./navbar-default/navbar-default.component";
import {ProfileMenuComponent} from "app/shared/profile-menu/profile-menu.component";
import {UserRequestModule} from "../user/user-request/user-request.module";
import {TruncatePipe} from "app/shared/pipes/truncate.pipe";
import {BsDropdownModule} from "ng2-bootstrap";

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    NgbModule,
    RoutingModule,
    BsDropdownModule,
    UserRequestModule
  ],
  exports: [
    NavbarUserComponent,
    NavbarAdminComponent,
    NavbarDefaultComponent,
    ProfileMenuComponent,
    TranslateModule,
    TruncatePipe
  ],
  declarations: [
    NavbarUserComponent,
    NavbarAdminComponent,
    NavbarDefaultComponent,
    LangsComponent,
    ProfileMenuComponent,
    TruncatePipe
  ]
})
export class SharedModule {
}
