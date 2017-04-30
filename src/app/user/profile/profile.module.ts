import {CommonModule} from '@angular/common';
import {CoreModule} from "app/core/core.module";
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputMaskModule} from 'primeng/primeng';
import {NgModule} from '@angular/core';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {RouterModule} from '@angular/router';
import {SelectModule} from "ng2-select";
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from "@ngx-translate/core";
import {ImageCropperModule} from 'ng2-img-cropper';
import {ModalDirective, ModalModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    TranslateModule,
    RouterModule,
    InputMaskModule,
    SelectModule,
    ModalModule
  ],
  declarations: [
    ProfileEditComponent
  ]
})

export class ProfileModule {
}