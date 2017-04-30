import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CalendarModule} from "angular-calendar";
import {ModalModule} from "ngx-bootstrap/modal";
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TranslateModule} from "@ngx-translate/core";
import {CalendarEventsComponent} from "./calendar-events/calendar-events.component";
import {EventDetailsModalComponent} from "./event-details-modal/event-details-modal.component";
import {UserRequestModule} from "../user-request/user-request.module";
import {EventsOauthService} from "./events-oauth.service";
import {ConfirmDialogModule, ConfirmationService} from "primeng/primeng";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    CalendarModule.forRoot(),
    ModalModule.forRoot(),
    UserRequestModule,
    TooltipModule
  ],
  exports: [CalendarEventsComponent],
  providers: [EventsOauthService, ConfirmationService],
  declarations: [CalendarEventsComponent, EventDetailsModalComponent]
})
export class EventsModule {
}
