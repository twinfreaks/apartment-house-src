import {Component, OnInit, Input, EventEmitter, Output, SimpleChanges} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import * as _ from "lodash";
import {CalendarEvent} from "app/shared/models/calendar-event";
import {TranslateService} from "@ngx-translate/core";
import {datePickerLangUk} from "i18n/datepicker-primeng"
import {datePickerLangEn} from "i18n/datepicker-primeng"
import {ViberService} from "../../../shared/services/viber-service";

@Component({
  selector: 'app-add-edit-event',
  templateUrl: './add-edit-event.component.html',
  styleUrls: ['./add-edit-event.component.css']
})
export class AddEditEventComponent implements OnInit {
  @Input() event: CalendarEvent = null;
  @Output() updateEvent: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  @Output() cancel: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  eventForm: FormGroup;
  newEvent: CalendarEvent;
  datePickerLang: any;
  title: string;
  description: string;
  start: Date;
  end: Date;
  noEnd: boolean;

  constructor(private translateService: TranslateService,
              private formBuilder: FormBuilder,
              private viberService: ViberService) {
  }

  ngOnInit() {
    let t = this;
    if (this.event) {
      this.newEvent = this.event;
      _.forOwn(this.event, function (value, key) {
        t[key] = value;
      });
    } else {
      this.newEvent = {title: '', description: '', start: moment().toDate(), end: moment().toDate()};
    }
    this.setDatePickerLanguage();
    this.eventForm = this.formBuilder.group({
      'title': [this.newEvent.title, Validators.required],
      'description': [this.newEvent.description, Validators.required],
      'start': [this.newEvent.start, Validators.required],
      'end': [this.newEvent.end]
    });
    this.noEnd = (this.newEvent.end)?false:true;
    this.viberService.getPAInfo().subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.newEvent = (changes['event'] && this.event) ? this.event : this.newEvent;
  }

  setNewEvent(property: string, value: any) {
    this.newEvent[property] = value;
  }

  checkWithoutEnd(checked: boolean) {
    this.noEnd = checked;
  }

  setDatePickerLanguage() {
    this.datePickerLang = this.translateService.currentLang === "en" ? datePickerLangEn : datePickerLangUk;
  }

  saveEvent() {
    let eventToEmit;
    if (this.event && this.event.id) {
      eventToEmit = this.event;
      _.forOwn(this.eventForm.value, function (value, key) {
        eventToEmit[key] = value;
      });
    } else {
      eventToEmit = this.eventForm.value;
    }
    eventToEmit.end = (this.noEnd)?null:eventToEmit.end;
    this.updateEvent.emit(eventToEmit);
  }

  checkValidity() {
    if(this.noEnd){
      return true;
    }
    return !(moment(this.eventForm.value.start).isAfter(this.eventForm.value.end))
  }

  emitCancel() {
    let t = this;
    if (this.event) {
      _.forOwn(this.event, function (value, key) {
        t.event[key] = t[key];
      });
      this.cancel.emit(this.event);
    } else {
      this.cancel.emit(this.newEvent);
    }
  }

  displayTitle() {
    if (this.event && typeof this.event.id === 'undefined') {
      return this.translateService.instant('ADD_EVENT');
    }
    return this.translateService.instant("EDIT_EVENT");
  }
}
