import {Injectable} from "@angular/core";
import {Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppConfig} from "../../app.config";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class ProfanityHttpService {
  private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
  private blogUrl: string = this.config.getConfig('api') + `/edit-profanity`;
  private uploadUrl: string = this.blogUrl + `/upload`;
  private vocabulary: string;
  
  constructor(private http: AuthHttp,
              private config: AppConfig) {
  }
  
  addToProfanity(word: any): Observable<any> {
    const body = JSON.stringify(word);
    const url = this.blogUrl + `/add`;
    return this.http.post(url, body, {headers: this.headers})
               .map((resp: Response) => resp.json())
               .catch((error: any) => {
                 return Observable.throw(error);
               });
  }
  
  getSensitivity() {
    let url = this.blogUrl + `/sensitivity`;
    return this.http.get(url, {headers: this.headers})
              .map((resp: Response) => resp.json())
              .catch((error: any) => {
                return Observable.throw(error);
              });
  }
  
  setSensitivity(id: number) {
    let url = this.blogUrl + `/sensitivity/${id}`;
    return this.http.put(url, {headers: this.headers})
              .map((resp: Response) => resp.json())
              .catch((error: any) => {
                return Observable.throw(error);
              });
  }
  
  uploadVocabulary(event: any, id: string) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData = new FormData();
      formData.append('file', file, file.name);
      let xhr: XMLHttpRequest = this.uploadRequest(formData, id);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("Success");
          } else {
            console.log("Error");
          }
        }
      }
    }
  }
  
  uploadRequest(formData, id) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    let url = `${this.uploadUrl}?vocabulary=${id}`;
    xhr.open('POST', url, true);
    xhr.setRequestHeader("enctype", "multipart/form-data");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Cache-Control", "no-store");
    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.send(formData);
    return xhr;
  }
}