import {Component, OnInit, ViewChild, Input, EventEmitter, Output} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";
import * as moment from "moment";
import {CalendarEvent} from "app/shared/models/calendar-event";
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "app/app.config";

@Component({
  selector: 'app-event-details-modal',
  templateUrl: './event-details-modal.component.html',
  styleUrls: ['./event-details-modal.component.css']
})
export class EventDetailsModalComponent implements OnInit {
  @Input() modalData;
  @ViewChild('eventModal') modal: ModalDirective;
  @Output() setNewDate: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  dateFormat: any = this.config.getConfig('dateFormat');

  constructor(private translateService: TranslateService, private config: AppConfig) {
  }

  ngOnInit() {
  }

  showModal() {
    this.modal.show();
  }

  showDate(date: string): string {
    return moment(date).format(this.dateFormat.fullDate)
  }

  showDateWithoutHHmm(date: string): string {
    return moment(date).format(this.dateFormat.fullWithoutHour)
  }

  emitEvent() {
    if (this.modalData.action == 'Dropped') {
      this.setNewDate.emit(this.modalData);
    } else {
      this.confirm.emit(this.modalData);
    }
  }
}
