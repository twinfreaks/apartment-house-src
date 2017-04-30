import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RoutingModule} from "app/routing/routing.module";
import {SharedModule} from "app/shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CalendarModule} from "primeng/primeng";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {AlertModule} from "ngx-bootstrap";
import {StatisticsComponent} from "./statistics/statistics.component";
import {StatisticsHttpService} from "./services/statisctics-http.service";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    SharedModule,
    TranslateModule.forChild(),
    ChartsModule,
    NgbModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule
  ],
  declarations: [
    StatisticsComponent
  ],
  providers: [
    StatisticsHttpService
  ]
})
export class AdminStatisticsModule { }
