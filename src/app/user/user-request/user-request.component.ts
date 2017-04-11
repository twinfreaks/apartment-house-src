import {Component, OnInit} from "@angular/core";
import {RequestHttpService} from "../../shared/services/request-http.service";
import {Request} from "../../shared/models/request.model";
import {AuthAppService} from "../../auth/services/auth-app.service";

@Component({
    selector: 'user-request',
    templateUrl: './user-request.component.html',
    styleUrls: ['user-request.component.scss']
})

export class UserRequestComponent implements OnInit {
    inhabitantId: number;
    categories = [];
    categoryIndex: number;
    request = new Request();
    reqWidth = 0;

    constructor(private requestService: RequestHttpService,
                private authService: AuthAppService) {
    }

    ngOnInit() {
        this.getInhabitantId();
        this.getRequestTypes();
    }

    getRequestTypes() {
        this.requestService.getTypes().subscribe(
            (data) => {
                this.categories = data['data']
            }
        )
    }

    getInhabitantId() {
        this.authService.inhabitantIdSub.subscribe(
            (data) => {
                this.inhabitantId = data;
                this.request.inhabitant = this.inhabitantId;
            }
        )
    }

    sendRequest() {
        if (this.isReqValid()) {
            this.request.requestType = this.categories[this.categoryIndex-1].id;
            this.requestService.sendRequest(this.request).subscribe(
                (data) => {}
            )
        }
    }

    isReqValid() {
        return this.request.text && this.request.requestType;
    }

    clearRequest() {
        this.request = new Request();
        this.request.inhabitant = this.inhabitantId;
    }

    closeRequest() {
        this.reqWidth = 0;
    }

    openRequest() {
        this.reqWidth = 70;
    }
}
