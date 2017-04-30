import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AppConfig} from "app/app.config";
import * as moment from "moment/moment";

@Injectable()
export class EventsOauthService {

  oauthToken: string;

  constructor(private http: Http,
              private config: AppConfig) {
  }

  getUrlForEvents(email){
    return `${this.config.getConfig('google.calendar')}/${email}/events`;
  }

  getEvents(email, date, period): any{
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'OAuth ' + this.oauthToken}),
        options = new RequestOptions({headers: headers});
    return this.http.get(`${this.getUrlForEvents(email)}?timeMin=${encodeURIComponent(moment(date).startOf(period).format())}&timeMax=${encodeURIComponent(moment(date).endOf(period).format())}`, options)
      .map((resp: Response) => resp.json())
      .map((res) => {
        return res;
      })
  }

  newEvent(email, event): any {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'OAuth ' + this.oauthToken}),
        options = new RequestOptions({headers: headers});
    return this.http.post(this.getUrlForEvents(email), this.formEventForPost(event), options)
      .map((resp: Response) => resp.json())
      .map((res) => {
        return res;
      })
  }

  deleteEvent(email, id){
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'OAuth ' + this.oauthToken}),
      options = new RequestOptions({headers: headers});
    return this.http.delete(this.getUrlForEvents(email) + '/' + id, options)
      .map((resp: Response) => resp.json())
      .map((res) => {
        return res;
      })
  }

  formEventForPost(event){
    let result = {summary: '', description: '', end: {}, start: {}};
    result.summary = event.title;
    result.description = event.description;
    if(event.end === null){
      result.end = {dateTime: event.start};
    } else {
      result.end = {dateTime: event.end};
    }
    result.start = {dateTime: event.start};
    return result;
  }

}
