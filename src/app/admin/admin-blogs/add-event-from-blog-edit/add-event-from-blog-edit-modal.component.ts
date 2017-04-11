import {Component, OnInit, ViewChild, EventEmitter, Output} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";
import * as moment from "moment";

import {CalendarEvent} from "app/shared/models/calendar-event";

@Component({
  selector: 'app-add-event-from-blog-edit-modal',
  templateUrl: './add-event-from-blog-edit-modal.component.html',
  styleUrls: ['./add-event-from-blog-edit-modal.component.css']
})
export class AddEventFromBlogEditModalComponent implements OnInit {
  @ViewChild('lgModal') public modal: ModalDirective;
  @Output() addEvent: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  @Output() cancel: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  activeEvent: CalendarEvent = {title: '', description: '', start: moment().toDate(), end: moment().toDate()};

  constructor() {
  }

  ngOnInit() {
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  onAddEvent(newEvent) {
    this.addEvent.emit(newEvent);
  }

  onCloseAddEventModal() {
    this.cancel.emit();
    this.hide();
  }
}
