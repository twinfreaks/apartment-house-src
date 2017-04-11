import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CalendarModule} from "angular-calendar";
import {ModalModule} from "ng2-bootstrap/modal";
import {TooltipModule} from 'ng2-bootstrap/tooltip';
import {TranslateModule} from "@ngx-translate/core";
import {CalendarEventsComponent} from "./calendar-events/calendar-events.component";
import {EventDetailsModalComponent} from "./event-details-modal/event-details-modal.component";
import {UserRequestModule} from "../user-request/user-request.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CalendarModule.forRoot(),
    ModalModule.forRoot(),
    UserRequestModule,
    TooltipModule
  ],
  exports: [CalendarEventsComponent],
  declarations: [CalendarEventsComponent, EventDetailsModalComponent]
})
export class EventsModule {
}
