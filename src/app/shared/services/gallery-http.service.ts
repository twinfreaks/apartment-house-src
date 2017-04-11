import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import * as _ from "lodash";

import {ImageOfGallery} from "app/shared/models/image-of-gallery";
import {AppConfig} from "app/app.config";

@Injectable()

export class GalleryHttpService {
    private headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
    private galleryUrl = this.config.getConfig('api')+`/gallery`;

    constructor (
        private http: Http,
        private config: AppConfig
    ) {}

    getGallery(blogId: number): Observable<[ImageOfGallery]> {
        const url = `${this.galleryUrl}?blog=${blogId}`;
        return this.http.get(url)
                        .map((resp:Response) => resp.json())
                        .catch((error: any) => {return Observable.throw(error);});
    }

    deleteImages(imagesId: number[]): Observable<ImageOfGallery> {
      let queryParams:string = "";
      _.forEach(imagesId, (id, index, arr) => {
        queryParams += "id=" + String(id);
        if (index !== arr.length - 1) {
          queryParams += "&";
        };
      });
      const url = `${this.galleryUrl}?${queryParams}`;
      return this.http.delete(url, { headers: this.headers })
        .map((resp: Response) => resp.json())
        .catch((error:any) =>{ return Observable.throw(error); });
    }

    postImages(obj: ImageOfGallery[]): Observable<ImageOfGallery[]>{
        const body = JSON.stringify(obj);
        return this.http.post(this.galleryUrl, body, { headers: this.headers })
                        .map((resp:Response) => resp.json())
                        .catch((error:any)  => { return Observable.throw(error); });
    }
}
