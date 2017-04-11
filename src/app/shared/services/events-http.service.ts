import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {CalendarEvent} from "../models/calendar-event";

@Injectable()
export class EventsHttpService {

  private eventsUrl = this.config.getConfig('api') + '/events';
  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  constructor(private http: Http, private config: AppConfig) {
  }

  getAllEvents(): Observable<[Event]> {
    return this.http.get(this.eventsUrl)
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
}
