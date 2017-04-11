import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import * as io from "socket.io-client";
import {AppConfig} from "app/app.config";
import {Headers, RequestOptions, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class ChatService {

  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  socket: any;
  connectionState: Subject<boolean> = new BehaviorSubject<boolean>(false);
  connectionError: Subject<string> = new Subject<string>();
  routeName: string = "/message";

  constructor(private config: AppConfig,
              private authHttp: AuthHttp) {
    this.socket = io(this.config.getConfig("api") + this.routeName);
    this.socket.on("connect", () => {
      this.connectionState.next(true);
    });
    this.socket.on("disconnect", () => {
      this.connectionState.next(false);
    });
    this.socket.on("error", (error: string) => {
      this.connectionError.next(error);
    });
  }

  getFlow(): Observable<any> {
    return Observable.create((observer: any) => {
      this.socket.on("create", (item: any) => observer.next({action: "create", item: item}));
      this.socket.on("update", (item: any) => observer.next({action: "update", item: item}));
      this.socket.on("remove", (item: any) => observer.next({action: "remove", item: item}));
      return () => this.socket.close();
    });
  }

  getPrevious(): Observable<Response> {
    return this.authHttp.get(this.config.getConfig('api') + `/messages`, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
        return res;
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getLazy(firstDate: string): Observable<Response> {
    let queryParams = '?type=lazy&firstDate=' + firstDate;
    return this.authHttp.get(this.config.getConfig('api') + `/messages` + queryParams, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
        return res;
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  create(message: string) {
    this.socket.emit("create", message);
  }

  setReaded(inhabitant: string) {
    this.socket.emit("readed", inhabitant);
  }
}
