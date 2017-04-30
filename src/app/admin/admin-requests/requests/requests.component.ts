import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import * as _ from "lodash";
import {PaginationInstance} from 'ngx-pagination';
import {AppConfig} from "app/app.config";
import {RequestHttpService} from "app/shared/services/request-http.service";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  config: PaginationInstance = this.appConfig.getConfig('requestPagination');
  requests: Array<Object> = [];
  currentRequests: Array<any> = [];
  currentTypeRequest: string;
  currentCount: number = null;
  requestToConfirm: Object = {};
  noRequests: boolean = false;
  noRequestsByCategory: boolean = false;
  typeIsSet: boolean = false;
  sendingToServer: boolean = false;

  constructor(private translateService: TranslateService,
              private requestHttpService: RequestHttpService,
              private toastrService: ToastrService,
              private appConfig: AppConfig) {
  }

  ngOnInit() {
    this.getTypes();
  }

  getTypes() {
    this.requestHttpService.getTypes()
      .subscribe(
        (data) => {
          this.requests.push({
            "requestId": 0,
            "requestType": this.translateService.instant('ALL_REQUESTS'),
            "count": 0,
            "requests": []
          });
          _.forEach(data['data'], (value) => {
            this.requests.push({
              "requestId": value.id,
              "requestType": value.name,
              "count": 0,
              "requests": []
            })
          });
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        },
        () => {
          this.getAllRequests();
        }
      );
  }

  getAllRequests() {
    this.requestHttpService.getAllRequests()
      .subscribe(
        (data) => {
          if (data['data'].length === 0) {
            this.noRequests = true;
            return;
          }
          _.forEach(data['data'], (currentRequest) => {
            let reqId = currentRequest.requestType;
            let index = _.findIndex(this.requests, (requestType) => {
              return requestType['requestId'] === reqId;
            });
            if (index < 0) {
              return;
            }
            if (currentRequest.isDone === false) {
              this.requests[index]['count']++;
              this.requests[0]['count']++;
            }
            this.requests[index]['requests'].push(currentRequest);
            this.requests[0]['requests'].push(currentRequest);
          });

        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        },
        () => {
          this.changeReqType(0, this.requests[0]['requestType'], this.requests[0]['count'])
        }
      );
  }

  putRequestConfirmed(request: any) {
    this.requestHttpService.updateRequeast(request)
      .subscribe(
        (data) => { },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_UPDATE_ERROR'));
          this.sendingToServer = false;
        },
        () => {
          this.toastrService.success(this.translateService.instant('REQUEST_IS_UPDATED'));
          this.requestToConfirm['isDone'] = true;
          let indexOfRequestType = _.findIndex(this.requests, (request) => {
            return request['requestType'] === this.currentTypeRequest;
          });
          this.requests[indexOfRequestType]['count']--;
          this.currentCount--;
          this.sendingToServer = false;
        }
      );
  }

  changeReqType(reqId: number, reqType: string, count: number) {
    this.typeIsSet = true;
    this.noRequestsByCategory = false;
    this.currentTypeRequest = reqType;
    this.currentCount = count;
    let index = _.findIndex(this.requests, (requestType) => {
      return requestType['requestId'] === reqId;
    });
    this.currentRequests = this.requests[index]['requests'];
    if (this.currentRequests.length === 0) {
      this.noRequestsByCategory = true;
    }
    this.config.currentPage = 1;
  }

  confirmDone(item) {
    this.sendingToServer = true;
    this.requestToConfirm = item;
    let requestToConfirm = Object.assign({}, item);
    requestToConfirm.isDone = true;
    this.putRequestConfirmed(requestToConfirm);
  }
}
