import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

import {Blog} from "../models/blog";
import {AppConfig} from "../../app.config";
import {AuthHttp} from "angular2-jwt";

@Injectable()

export class BlogHttpService {
  private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
  private blogUrl = this.config.getConfig('api') + `/blogs`;

  constructor(private http: AuthHttp,
              private config: AppConfig) {
  }

  getBlogs(): Observable<[Blog]> {
    return this.http
      .get(this.blogUrl)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getBlogsForPagePagination(page: number): Observable<[Blog]> {
    const url = `${this.blogUrl}?page=${page}`;
    return this.http
      .get(url)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getBlogById(id: number): Observable<Blog> {
    const url = `${this.blogUrl}/${id}`;
    return this.http
      .get(url)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  getNearBlogs(id: number): Observable<Blog> {
    const near = '?type=blogNear';
    const url = `${this.blogUrl}/${id}`;
    return this.http
      .get(url + near)
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  deleteBlogById(id: number): Observable<Blog> {
    const url = `${this.blogUrl}/${id}`;
    return this.http
      .delete(url, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  putBlog(obj: Blog): Observable<Blog> {
    const url = `${this.blogUrl}/${obj.id}`;
    const body = JSON.stringify(obj);
    return this.http
      .put(url, body, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  postBlog(obj: Blog): Observable<Blog> {
    const body = JSON.stringify(obj);
    return this.http
      .post(this.blogUrl, body, {headers: this.headers})
      .map((resp: Response) => resp.json())
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }
}
