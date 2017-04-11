import {Component, OnInit} from "@angular/core";
import {CalculationService} from "app/shared/services/calculation.service";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {TranslateService} from "@ngx-translate/core";
import {Calculation} from "../calculation.model";
import {AppConfig} from "app/app.config";
import {ToastrService} from "ngx-toastr";
import * as moment from "moment/moment";
import * as _ from "lodash";
import {DashboardHttpService} from "../../../shared/services/dashboard-http.service";

@Component({
  selector: 'app-user-calculation',
  templateUrl: './user-calculation.component.html',
  styleUrls: ['./user-calculation.component.scss']
})

export class UserCalculationComponent implements OnInit {

  constructor(private calculationservice: CalculationService,
              private authAppService: AuthAppService,
              private translateService: TranslateService,
              private config: AppConfig,
              private toastrService: ToastrService,
              private dashboardService: DashboardHttpService) {
  }

  throttle = this.config.getConfig('infiniteScroll')['throttle'];
  scrollDistance = this.config.getConfig('infiniteScroll')['scrollDistance'];
  page: number = 1;
  totalPage: number;
  isLoading: boolean = true;
  imageUrl = `${this.config.getConfig('api')}/calculation-types`;
  defaultValue: any = {"id": "0", "text": ''};
  typeId: any = 0;
  types: any = [];
  calculations: Calculation[] = [];
  inhabitantId: number;
  dateFormat: any = this.config.getConfig('dateFormat');
  toTopShow: boolean = false;

  ngOnInit() {
    this.translateService.get("SHOW_ALL")
        .subscribe((res: string) => {
          this.defaultValue.text = res;
        });
    this.inhabitantId = this.authAppService.getInhabitantId();
    this.calculationservice.getAllTypes()
        .subscribe(
            (types) => {
              let t = this;
              this.types = _.map(types, t.initSelectItem);
              this.types.unshift(this.defaultValue);
            },
            (err) => {
              this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
            }
        );
    this.getCalculations(this.page);
  }

  getCalculations(page) {
    this.calculationservice.getInhabitantCalculations(this.inhabitantId, this.page, this.typeId)
        .subscribe(
            (data) => {
              if (this.page == 1) {
                this.calculations = data['calculations'];
              } else {
                this.calculations = this.calculations.concat(data['calculations']);
              }
              this.totalPage = data['totalPage'];
              this.calculations = _.orderBy(this.calculations, 'date', 'desc');
            },
            (err) => {
              this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
            },
            () => {
              this.isLoading = false;
            }
        )
  }

  displayDate(date) {
    return moment(date).format(this.dateFormat.dateSlash);
  }

  initSelectItem(type) {
    return {"id": type.id, "text": type.name};
  }

  filterTypes(event) {
    this.toTopShow = false;
    this.page = 1;
    this.typeId = event.id;
    this.getCalculations(this.page);
  }

  findPayed(index, type) {
    if (this.typeId == 0) {
      return this.findPayedForType(index, type);
    } else if (this.calculations[index - 1]) {
      return this.calculations[index - 1].payedAmount;
    }
    return '0';
  }

  findPayedForType(index, type) {
    for (let i = index - 1; i >= 0; i--) {
      if (this.calculations[i].calculationType.id == type) {
        return this.calculations[i].payedAmount;
      }
    }
    return '0';
  }

  onScrollDown() {
    this.toTopShow = true;
    if (this.page < this.totalPage && !this.isLoading) {
      this.page++;
      this.isLoading = true;
      this.getCalculations(this.page);
    }
  }
}
