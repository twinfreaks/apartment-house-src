import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AuthAppService} from "app/auth/services/auth-app.service";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {CalendarEvent} from "../models/calendar-event";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class EventsHttpService {

  private eventsUrl = this.config.getConfig('api') + '/events';
  private eventGCUrl = this.config.getConfig('api') + '/google-calendar';
  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private http: AuthHttp,
              private config: AppConfig,
              private authAppService: AuthAppService,) {
  }

  getAllEvents(isOAuth?): Observable<[Event]> {
    isOAuth = (isOAuth)? true : false;
    return this.http.get(`${this.eventsUrl}?isOAuth=${isOAuth}&inhabitant=${this.authAppService.getInhabitantId()}`)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  updateEvent(event: CalendarEvent) {
    return this.http.put(this.eventsUrl + '/' + event.id, event, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error);
      })
  }

  postEvent(event: CalendarEvent) {
    return this.http.post(this.eventsUrl, event, this.options)
      .map((resp: Response) => resp.json())
  }

  deleteEvent(event: CalendarEvent) {
    return this.http.delete(this.eventsUrl + '/' + event.id, this.options)
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  addToGoogleCalendar(googleEvent){
    return this.http.post(this.eventGCUrl, googleEvent, this.options)
      .map((resp: Response) => resp.json())
  }

  deleteFromGoogleCalendar(eventgoogle){
    return this.http.delete(`${this.eventGCUrl}/${eventgoogle.id}`, this.options)
      .map((resp: Response) => resp.json())
  }
}
