import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {CommentsModel} from "../models/comments.model";
import {AppConfig} from "../../app.config";
import {AuthAppService} from "app/auth/services/auth-app.service";
import * as _ from "lodash";

@Injectable()
export class CommentsHttpService {
  private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
  private blogUrl: string = this.config.getConfig('api') + `/comments`;
  public blogComments: number; // take from comments compoment
  public parentCommentId: number = null; // ID of parent comment-single when answer
  public commentId: number = null;
  public commentText: string;
  public commentsToShow: number = this.config.getConfig('commentsAndBlog').commentsToShowScroll;
  public userRole: string;
  private userRolesArray: [string] = ['adminBlog', 'adminAccountant'];
  
  constructor(private http: Http,
              private config: AppConfig,
              private authAppService: AuthAppService) {
  }
  
  isAdmin() {
    this.userRole = this.authAppService.getRoles();
    return _.includes(this.userRolesArray, this.userRole[0]);
  }
  
  getComments(): Observable<[CommentsModel]> {
    const url = `${this.blogUrl}?blogComments=${this.blogComments}`;
    return this.http.get(url)
               .map((resp: Response) => resp.json())
               .catch((error: any) => {
                 return Observable.throw(error);
               });
  }
  
  postComment(obj: CommentsModel): Observable<CommentsModel> {
    const body = JSON.stringify(obj);
    return this.http.post(this.blogUrl, body, {headers: this.headers})
               .map((resp: Response) => resp.json())
               .catch((error: any) => {
                 return Observable.throw(error);
               });
  }
  
  getInhabitantInfo(id: string) {
    const url = this.blogUrl + `/inhabitantInfo/${id}`;
    return this.http.get(url)
               .map((resp: Response) => resp.json())
               .catch((error: any) => {
                 return Observable.throw(error);
               });
  }
  
  updateComments(obj: CommentsModel): Observable<[CommentsModel]> {
    const body = JSON.stringify(obj);
    return this.http.put(this.blogUrl, body, {headers: this.headers})
               .map((resp: Response) => resp.json())
               .catch((error: any) => {
                 return Observable.throw(error);
               });
  }
}