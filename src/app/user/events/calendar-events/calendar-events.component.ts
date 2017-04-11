import {Component, OnInit} from "@angular/core";
import {isSameDay, isSameMonth} from "date-fns";
import * as moment from "moment";
import {EventsHttpService} from "app/shared/services/events-http.service";
import {CalendarEvent} from "app/shared/models/calendar-event";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
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

  constructor(private eventsHttpService: EventsHttpService,
              private translateService: TranslateService,
              private config: AppConfig,
              private toastrService: ToastrService) {
  }

  events: CalendarEvent[];
  dateFormat: any = this.config.getConfig('dateFormat');
  activeDayIsOpen: boolean = false;
  view: string = 'month';
  locale: any;
  periodTitle: string;
  viewDate: Date = new Date();
  modalData = {
    action: '',
    event: null
  };

  ngOnInit() {
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

  setEvents(data: any): CalendarEvent[] {
    return  _.map(data, (event, index) => {
      event['end'] = (event['end'] === null) ? event['end'] : moment(event['end']).toDate();
      event['start'] = moment(event['start']).toDate();
      event['color'] = colors[index % (colors.length)];
      return event;
    });
  }

  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {
    if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
      this.activeDayIsOpen = false;
    } else if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = true;
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {action, event};
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
}
