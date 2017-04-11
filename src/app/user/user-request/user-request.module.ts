import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {UserRequestComponent} from "./user-request.component";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  exports: [
    UserRequestComponent
  ],
  declarations: [
    UserRequestComponent
  ],
  providers: [],
})
export class UserRequestModule {
}
