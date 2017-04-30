import {Component, OnInit} from "@angular/core";
import {isSameDay, isSameMonth} from "date-fns";
import * as moment from "moment";
import {CalendarEventAction} from "angular-calendar";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {EventsHttpService} from "app/shared/services/events-http.service";
import {CalendarEvent} from "app/shared/models/calendar-event";
import {TranslateService} from "@ngx-translate/core";
import {EventsOauthService} from "../events-oauth.service";
import {AuthOauthService} from "app/oauth/services/auth-oauth.service";
import {ConfirmationService} from "primeng/primeng";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs/Subject";
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
  styleUrls: ['./calendar-events.component.scss']
})

export class CalendarEventsComponent implements OnInit {

  isOAuth: boolean = false;
  events: CalendarEvent[];
  googleEvents: CalendarEvent[];
  dateFormat: any = this.config.getConfig('dateFormat');
  activeDayIsOpen: boolean = false;
  view: string = 'month';
  locale: any;
  periodTitle: string;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  tooltips: any = {
    addGC: '',
    deleteGC: ''
  };
  addToGC: CalendarEventAction[];
  deleteFromGC: CalendarEventAction[];
  modalData = {
    action: '',
    event: null
  };
  googleEventsShow: boolean = false;

  constructor(private eventsHttpService: EventsHttpService,
              private eventsOauthService: EventsOauthService,
              private translateService: TranslateService,
              private authAppService: AuthAppService,
              private confirmationService: ConfirmationService,
              private config: AppConfig,
              private toastrService: ToastrService,
              private oauthService: AuthOauthService) {
  }

  ngOnInit() {
    this.translateService.get("ADD_TO_GOOGLE_CALENDAR")
      .subscribe((res: string) => {
        this.tooltips.addGC = res;
      });
    this.translateService.get("DELETE_FROM_GOOGLE_CALENDAR")
      .subscribe((res: string) => {
        this.tooltips.deleteGC = res;
      });
    this.setAddToGC();
    this.setDeleteFromGC();
    if(localStorage.getItem('oauthProvider') === 'google') {
      this.isOAuth = true;
      this.eventsOauthService.oauthToken = localStorage.getItem('oauthToken');
    }
    this.locale = this.translateService.currentLang;
    this.periodTitle = moment(this.viewDate).format(this.dateFormat.month);
    this.eventsHttpService.getAllEvents(this.isOAuth)
      .subscribe(
        (data) => {
          if(typeof data['data'] !== 'string') {
            this.events = this.setEvents(data['data']);
          } else {
            this.events = [];
          }
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
      if(this.isOAuth && event['eventgoogles'].length > 0){
        event['actions'] = this.deleteFromGC;
      } else if(this.isOAuth){
        event['actions'] = this.addToGC;
      }
      return event;
    });
  }

  setAddToGC(){
    this.addToGC = [{
      label: '<div class="tooltip-wrap"><img width="25px" height="25px" src="./assets/img/google_calendar_icon.png"><span class="tooltip-text width">'
      + this.tooltips.addGC + '</span></img></div>',
      onClick: ({event}: {event: CalendarEvent}): void => {
        this.addEventToGC(event);
      }
    }];
  }

  setDeleteFromGC(){
    this.deleteFromGC = [{
      label: '<div class="tooltip-wrap"><i class="fa fa-fw fa-times fa-lg red"><span class="tooltip-text width">'
      + this.tooltips.deleteGC + '</span></i></div>',
      onClick: ({event}: {event: CalendarEvent}): void => {
        this.deleteEventFromGC(event);
      }
    }];
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

  renewPeriodTitle(){
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

  getGoogleEvetns(){
    this.googleEvents = [];
    this.eventsOauthService.getEvents(localStorage.getItem('username'), this.viewDate, this.view)
    .subscribe(
      (data) => {
        this.setGoogleEvents(data);
      },
      (err) => {
        if(err.status === 401){
          this.oauthService.getOAuthUrl('google');
        } else {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      }
    );
  }

  setGoogleEvents(data){
    let googleEv = data.items;
    this.googleEvents = _.map(googleEv, (gEvent, index) => {
      let event: CalendarEvent = {title: '', description: '', start: null, end: null};
      event.title = gEvent['summary'];
      event.description = gEvent['description'];
      if(typeof gEvent['start']['dateTime'] !== 'undefined'){
        event.start = moment(gEvent['start']['dateTime']).toDate();
      } else if(typeof gEvent['start']['date'] !== 'undefined'){
        event.start = moment(gEvent['start']['date'], "YYYY-MM-DD").startOf('day').toDate();
      }
      if(typeof gEvent['end']['dateTime'] !== 'undefined'){
        event.end = moment(gEvent['end']['dateTime']).toDate();
      } else if(typeof gEvent['end']['date'] !== 'undefined'){
        event.end = moment(gEvent['end']['date'], "YYYY-MM-DD").subtract(1,'days').startOf('day').toDate();
      }
      event.color = colors[1];
      return event;
    });
    this.displayGoogleEvetns();
  }

  displayGoogleEvetns(){
    _.forEach(this.events, (event) => {
      event.color = colors[0];
    });
    _.forEach(this.googleEvents, (event) => {
      this.events.push(event);
    });
    this.refresh.next();
    this.googleEventsShow = true;
  }

  addEventToGC(event){
    this.confirmationService.confirm({
      message: event.title + '. ' + this.translateService.instant('ADD_TO_GOOGLE_CALENDAR'),
      accept: () => {
        this.eventsOauthService.newEvent(localStorage.getItem('username'), event)
          .subscribe(
            (data) => {
              let googleEvent = {googleId: data['id'], event: event.id, inhabitant: this.authAppService.getInhabitantId()};
              this.eventsHttpService.addToGoogleCalendar(googleEvent)
                .subscribe(
                  (data) => {
                    let gEv: CalendarEvent;
                    _.forEach(this.events, (ev) => {
                      if(ev.id === event.id){
                        gEv = ev;
                        ev['actions'] = this.deleteFromGC;
                        ev['eventgoogles'][0] = data['data'];
                      }
                    });
                    if(this.googleEventsShow && typeof gEv != 'undefined'){
                      this.events.push({
                        title: gEv.title,
                        description: gEv.description,
                        start: gEv.start,
                        end: gEv.end,
                        color: colors[1]
                      });
                      this.refresh.next();
                    }
                  },
                  (err) => {
                    this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
                  }
                )
              this.toastrService.success(this.translateService.instant("ADDED_TO_GC"));
            },
            (err) => {
              if(err.status === 401){
                this.oauthService.getOAuthUrl('google');
              } else {
                this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
              }
            }
          );
      }
    });
  }

  deleteEventFromGC(event){
    this.confirmationService.confirm({
      message: event.title + '. ' + this.translateService.instant('DELETE_FROM_GOOGLE_CALENDAR'),
      accept: () => {
        this.eventsOauthService.deleteEvent(localStorage.getItem('username'), event.eventgoogles[0].googleId)
          .subscribe(
            (data) => {
              deleteGC();
              this.toastrService.success(this.translateService.instant("DELETED_TO_GC"));
            },
            (err) => {
              if(err.status === 410){
                deleteGC();
                this.toastrService.success(this.translateService.instant("DELETED_TO_GC"));
              } else {
                this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
              }
            }
          );
      }
    });
    let deleteGC = () => {
      this.eventsHttpService.deleteFromGoogleCalendar(event.eventgoogles[0])
        .subscribe(
          (data) => {
            let i;
            _.forEach(this.events, (ev, index) => {
              if(ev.id === event.id){
                ev['actions'] = this.addToGC;
                ev['eventgoogles'] = [];
              }
              if(this.googleEventsShow && ev.title == event.title && ev.description == event.description && ev.color.primary == colors[1].primary){
                i = index;
              }
            });
            if(typeof i != 'undefined'){
              this.events.splice(i, 1);
            }
            this.refresh.next();
          },
          (err) => {
            this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
          }
        )
    }
  }

  hideGoogleEvents(multicolor: boolean){
    this.events = _.filter(this.events, function(e) {
      return e.color.primary == colors[0].primary;
    });
    if(multicolor){
      _.forEach(this.events, (event, index) => {
        event.color = colors[index % (colors.length)];
      });
    }
    this.refresh.next();
    this.googleEventsShow = false;
  }

  renewGoogleEvents(){
    if(!this.googleEventsShow){
      return;
    } else {
      this.hideGoogleEvents(false);
      this.getGoogleEvetns();
    }
  }
}