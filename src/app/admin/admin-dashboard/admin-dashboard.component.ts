import {Component, OnInit} from "@angular/core";
import {InhabitantsService} from "../admin-inhabitants/services/inhabitants.service";
import {RequestHttpService} from "app/shared/services/request-http.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AuthAppService} from "../../auth/services/auth-app.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  inhabitantsInactiveCount: number;
  requestsNotDoneCount: number;
  role: string;

  constructor(private inhabitantsService: InhabitantsService,
              private requestHttpService: RequestHttpService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private authAppService: AuthAppService
  ) { }

  getRequestsNotDoneCount() {
    this.requestHttpService.getCountOfNotDoneRequests()
      .subscribe(data => {
          this.requestsNotDoneCount = data['data'];
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        })
  };

  ngOnInit(){
    this.getRequestsNotDoneCount();
    this.inhabitantsService.getInhabitantsCounter()
        .subscribe(
            (data) => {
              this.inhabitantsInactiveCount = data;
            }
        );
    this.role = this.authAppService.getRoles()[0];
  }
}
