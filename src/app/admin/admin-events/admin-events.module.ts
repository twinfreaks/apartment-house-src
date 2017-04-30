import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule}   from "@angular/forms";
import {CalendarModule} from "angular-calendar";
import {ModalModule} from "ngx-bootstrap/modal";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {NgbDatepickerModule, NgbTimepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {CalendarEventsComponent} from "./calendar-events/calendar-events.component";
import {EventDetailsModalComponent} from "./event-details-modal/event-details-modal.component";
import {AddEditEventComponent} from "./add-edit-event/add-edit-event.component";
import {DateTimePickerComponent} from "./date-time-picker/date-time-picker.component";
import {CalendarModule as DatePicker} from "primeng/primeng";
import {TranslateModule} from "@ngx-translate/core";
import {ViberModule} from "../viber/viber.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DatePicker,
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    CalendarModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ViberModule
  ],
  exports: [CalendarEventsComponent, AddEditEventComponent],
  declarations: [CalendarEventsComponent, EventDetailsModalComponent, AddEditEventComponent, DateTimePickerComponent]
})
export class AdminEventsModule {
}
