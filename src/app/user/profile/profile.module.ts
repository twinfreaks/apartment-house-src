import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser"
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule, Routes} from "@angular/router"

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule
  ],
  declarations: [ProfileEditComponent]
})

export class ProfileModule {}