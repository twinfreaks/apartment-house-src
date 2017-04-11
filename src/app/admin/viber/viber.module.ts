import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ViberComponent} from "./viber.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  exports: [
    ViberComponent
  ],
  declarations: [
    ViberComponent
  ],
  providers: [],
})
export class ViberModule {
}
