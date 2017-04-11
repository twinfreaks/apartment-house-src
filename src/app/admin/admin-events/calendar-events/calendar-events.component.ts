import {Component, ViewChild, OnInit} from "@angular/core";
import {CalendarEventAction} from "angular-calendar";
import {Subject} from "rxjs/Subject";
import {isSameDay, isSameMonth} from "date-fns";
import * as moment from "moment";
import {EventDetailsModalComponent} from "../event-details-modal/event-details-modal.component";
import {EventsHttpService} from "app/shared/services/events-http.service";
import {CalendarEvent} from "app/shared/models/calendar-event";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "app/app.config";
import * as _ from "lodash";

const colors: any = [
  {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
];

@Component({
  selector: 'app-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.css']
})
export class CalendarEventsComponent implements OnInit {
  @ViewChild(EventDetailsModalComponent) eventModal: EventDetailsModalComponent;

  constructor(private eventsHttpService: EventsHttpService,
              private translateService: TranslateService,
              private toastrService: ToastrService,
              private config: AppConfig) {
  }

  dateFormat: any = this.config.getConfig('dateFormat');
  events: CalendarEvent[];
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;
  activeEvent: CalendarEvent = null;
  view: string = 'month';
  locale: string;
  periodTitle: string;
  viewDate: Date = new Date();
  tooltips: any = {
    details: '',
    edit: '',
    delete: '',
  };
  actions: CalendarEventAction[];

  modalData =  {
    action: '',
    event: null,
    change: null
  };

  ngOnInit() {
    this.translateService.get("DETAILS")
      .subscribe((res: string) => {
          this.tooltips.details = res;
          this.setActions();
      });
    this.translateService.get("EDIT")
      .subscribe((res: string) => {
          this.tooltips.edit = res;
          this.setActions();
      });
    this.translateService.get("DELETE")
      .subscribe((res: string) => {
          this.tooltips.delete = res;
          this.setActions();
      });
    this.locale = this.translateService.currentLang;
    this.periodTitle = moment(this.viewDate).format(this.dateFormat.month);
    this.eventsHttpService.getAllEvents()
      .subscribe(
        (data) => {
          this.events = this.setEvents(data['data']);
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      );
  }

  setActions(){
    this.actions = [{
      label: '<div class="tooltip-wrap"><i class="fa fa-fw fa-info fa-lg white"><span class="tooltip-text">'
      + this.tooltips.details + '</span></i></div>',
      onClick: ({event}: {event: CalendarEvent}): void => {
        this.handleEvent('Clicked', event, null);
      }
    }, {
      label: '<div class="tooltip-wrap"><i class="fa fa-fw fa-pencil fa-lg yellow"><span class="tooltip-text">'
      + this.tooltips.edit + '</span></i></div>',
      onClick: ({event}: {event: CalendarEvent}): void => {
        this.activeEvent = event;
      }
    }, {
      label: '<div class="tooltip-wrap"><i class="fa fa-fw fa-times fa-lg red"><span class="tooltip-text">'
      + this.tooltips.delete + '</span></i></div>',
      onClick: ({event}: {event: CalendarEvent}): void => {
        this.handleEvent('Delete', event, null);
      }
    }];
  }
  
  setEvents(data: any): CalendarEvent[]{
    let t = this,
        result: CalendarEvent[] = [];
    _.forEach(data, function(calc, index){
      result.push(t.setEvent(calc, index));
    });
    return result;
  }
  setEvent(data: any, i?: any): CalendarEvent{
    (data.end === null)?data.end:data.end = moment(data.end).toDate();
    data.start = moment(data.start).toDate();
    (isNaN(i)) ? data.color = colors[0] : data.color = colors[i % (colors.length)];
    data.draggable = true;
    data.actions = this.actions;
    return data;
  }

  updateDate(event){
    let newEvent: CalendarEvent = _.find(this.events, function(e) { return e.id === event.event.id; });
    newEvent.start = event.change.start;
    newEvent.end = event.change.end;
    this.updateEvent(newEvent);
  }

  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {
    if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
      this.activeDayIsOpen = false;
    } else if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = true;
      this.viewDate = date;
    }
  }

  eventTimesChanged({event, newStart, newEnd}): void {
    let change = {start: newStart, end: null};
    change.end = (event.end)?newEnd:null;
    this.handleEvent('Dropped', event, change);
    this.eventModal.showModal();
  }

  handleEvent(action: string, event: CalendarEvent, change: any): void {
    this.modalData = {action, event, change};
    this.eventModal.showModal();
  }

  editEvent(event) {
    this.activeEvent = Object.assign({}, event.event);
  }

  confirmEvent(event) {
    if (event.action == 'Delete') {
      this.deleteEvent(event.event);
    } else if (event.event.id) {
      this.updateEvent(event.event);
    } else {
      this.postEvent(event.event);
    }
  }

  deleteEvent(event) {
    this.eventsHttpService.deleteEvent(event)
    .subscribe(
      (data) => {
        let t = this;
        t.activeEvent = null;
        _.forEach(t.events, function(e, index){
          if(e.id == event.id){
            t.events.splice(index, 1);
            t.toastrService.success(t.translateService.instant('CHANGES_SAVED'), t.translateService.instant('SUCCESS_DELETE_EVENT'));
            t.refresh.next()
            return false;
          }
        });
      },
      (err) => {
        this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
      }
    )
  }

  postEvent(event) {
    this.eventsHttpService.postEvent(event)
      .subscribe(
        (data) => {
          this.events.push(this.setEvent(data['data']));
          this.activeEvent = null;
          this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('SUCCESS_POST_EVENT'));
          this.refresh.next();
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      );
  }

  updateEvent(event) {
    let index: number;
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].id === event.id) {
        index = i;
        break;
      }
    }
    this.eventsHttpService.updateEvent(event)
      .subscribe(
        (data) => {
          this.events[index] = this.setEvent(data['data'][0]);
          this.activeEvent = null;
          this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('SUCCESS_UPDATE_EVENT'));
          this.refresh.next();
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      );
  }

  newEvent() {
    this.activeEvent = {title: '', description: '', start: moment().toDate(), end: moment().toDate()}
  }

  renewPeriodTitle() {
    switch (this.view) {
      case 'month':
        this.periodTitle = moment(this.viewDate).format(this.dateFormat.month);
        break;
      case 'day':
        this.periodTitle = moment(this.viewDate).format(this.dateFormat.day);
        break;
      case 'week':
        this.periodTitle = this.translateService.instant('WEEK') + ' ' + moment(this.viewDate).format(this.dateFormat.week);
        break;
      default:
        this.periodTitle = moment(this.viewDate).format(this.dateFormat.month);
    }
  }

  cancelChanges() {
    this.activeEvent = null;
    this.toastrService.info(this.translateService.instant('CHANGES_NOT_SAVED'), this.translateService.instant('CANCEL'));
  }
}
