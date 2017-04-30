import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsPageComponent } from './user-settings-page/user-settings-page.component';
import {TranslateModule} from "@ngx-translate/core";
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ngx-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    MomentModule
  ],
  declarations: [UserSettingsPageComponent, ChangePasswordModalComponent]
})
export class UserSettingsModule { }
