import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as moment from 'moment';
import * as _ from 'lodash';
import {CustomValidators} from "ng2-validation";
import {saveAs} from 'file-saver';

import {StatisticsHttpService} from "app/admin/admin-statistics/services/statisctics-http.service";
import {datePickerLangUk} from "i18n/datepicker-primeng";
import {datePickerLangEn} from "i18n/datepicker-primeng";

@Component({
  selector: 'app-statistics',
  templateUrl: 'statistics.component.html',
  styleUrls: ['statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  datePeriodArr = [];
  statTypeArr = [];
  currentStatType: string = null;
  currentPeriod: string = null;
  datePeriodForm: FormGroup;
  datePickerLang: any;
  maxDateFrom: Date = new Date();
  minDateTo: Date;
  maxDateTo: Date = moment().add(1, 'days').toDate();
  dateFrom: string;
  dateTo: string;
  showDatePicker: boolean = false;
  noDataAlert: boolean = false;
  currentGetStatMethod: number = null;

  showPieChart: boolean = false;
  pieChartLabels:string[] = [];
  pieChartData:number[] = [];
  pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  colors: any[] = [{ backgroundColor: ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC']}];

  showBarChart: boolean = false;
  barChartData:any[] = [
    {data: [], label: ''},
    {data: [], label: ''}
  ];
  barChartLabels:string[] = [];
  barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scaleIntegersOnly: true,
    scales: {
      yAxes: [
        {ticks: {
          beginAtZero: true,
          callback: function(value, index, values) {
            if (Math.floor(value) === value) {
              return value;
            }
          }
      }}]}
  };

  constructor(private statisticsHttpService: StatisticsHttpService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private formBuilder: FormBuilder) {
    this.datePeriodForm = this.formBuilder.group({
      'dateFrom': [null, [Validators.required, CustomValidators.maxDate(moment().format('YYYY-MM-DD'))]],
      'dateTo': [null, [Validators.required, CustomValidators.maxDate(moment(this.maxDateTo).format('YYYY-MM-DD'))]]
    });
  };

  ngOnInit() {
    this.initStatTypeArr();
    this.initDatePeriodArr();
    this.datePickerLang = this.translateService.currentLang === "en" ? datePickerLangEn : datePickerLangUk;
    this.changeDateFromTyped();
  };

  changeStatType(type: string, i: number) {
    this.currentStatType = type;
    this.currentGetStatMethod = i;
    this.showDatePicker = false;
    this.noDataAlert = false;
    this.showPieChart = false;
    this.showBarChart = false;
    this.currentPeriod = null;
    this.dateFrom = null;
    this.dateTo = null
  }

  changePeriod(period: any) {
    this.noDataAlert = false;
    this.currentPeriod = period.name;
    if (period.dateFrom === null && period.dateTo === null) {
      this.showPieChart = false;
      this.showBarChart = false;
      this.showDatePicker = true;
      this.datePeriodForm.controls['dateFrom'].reset();
      this.datePeriodForm.controls['dateTo'].reset();
      return;
    }
    this.showDatePicker = false;
    this.dateFrom = moment(period.dateFrom).toISOString();
    this.dateTo = moment(period.dateTo).toISOString();
    this.chooseGetStatMethod(this.currentGetStatMethod);
  };

  checkNotNullElement(array) {
    return array.some((element, index, array) => {
      return element > 0;
    })
  }

  getStatByRequestTypes() {
    this.statisticsHttpService.getStat(this.dateFrom, this.dateTo, 'byRequestTypes')
      .subscribe(
        (data) => {
          if (data['data'].requestsCountByType.length === 0) {
            this.showPieChart = false;
            this.noDataAlert = true;
            return;
          }
          this.pieChartLabels.splice(0, this.pieChartLabels.length);
          _.forEach(data['data'].requestTypes, (elem) => {
            this.pieChartLabels.push(elem);
          });
          this.pieChartData = data['data'].requestsCountByType;
          this.pieChartData = this.pieChartData.slice();
          this.showPieChart = true;
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        }
      );
  };

  getStatByRequests() {
    this.statisticsHttpService.getStat(this.dateFrom, this.dateTo, 'byRequests')
      .subscribe(
        (data) => {
          if (!this.checkNotNullElement(data['data'].notDoneRequestsCount) &&
              !this.checkNotNullElement(data['data'].doneRequestsCount)) {
            this.showBarChart = false;
            this.noDataAlert = true;
            return;
          }
          this.barChartLabels.splice(0, this.barChartLabels.length);
          _.forEach(data['data'].labels, (elem) => {
            this.barChartLabels.push(elem);
          });
          this.barChartData[0]['data'] = data['data'].notDoneRequestsCount;
          this.barChartData[0]['label'] = this.translateService.instant('NEW_REQUESTS');
          this.barChartData[1]['data'] = data['data'].doneRequestsCount;
          this.barChartData[1]['label'] = this.translateService.instant('DONE_REQUESTS');
          this.barChartData = this.barChartData.slice();
          this.showBarChart = true;
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        }
      );
  };

  chooseGetStatMethod(index: number) {
    switch (index) {
      case 0:
        this.getStatByRequestTypes();
        break;
      case 1:
        this.getStatByRequests();
        break;
    }
  }

  downloadExcel() {
    if (this.dateFrom && this.dateTo) {
      switch (this.currentGetStatMethod) {
        case 0:
          this.getExportExcel('byRequestTypes');
          break;
        case 1:
          this.getExportExcel('byRequests');
          break;
      }
    }
  }

  getExportExcel(type) {
    this.statisticsHttpService.getExcelExport(this.dateFrom, this.dateTo, type, this.translateService.currentLang)
      .subscribe(
        (data) => {
          saveAs(new Blob([data]), 'Stat_report.xlsx')
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        }
      );
  }

  initStatTypeArr() {
    let statTypeArrLocal = [
      {name: 'BY_REQUEST_TYPES'},
      {name: 'BY_REQUESTS'}
    ];
    _.forEach(statTypeArrLocal, (elem) => {
      this.translateService.get(elem.name).subscribe((res: string) => {
        elem.name = res;
      });
    });
    this.statTypeArr = statTypeArrLocal;
  };

  initDatePeriodArr() {
    let datePeriodArrLocal = [
      {
        name: 'BY_CURRENT_DAY',
        dateFrom: (moment().startOf('day')),
        dateTo: moment().endOf('day')
      },
      {
        name: 'BY_CURRENT_WEEK',
        dateFrom: moment().startOf('week'),
        dateTo: moment().endOf('day')
      },
      {
        name: 'BY_CURRENT_MONTH',
        dateFrom: moment().startOf('month'),
        dateTo: moment().endOf('day'),
      },
      {
        name: 'BY_CURRENT_YEAR',
        dateFrom: moment().startOf('year'),
        dateTo: moment().endOf('day'),
      },
      {
        name: 'BY_LAST_MONTH',
        dateFrom: moment().startOf('month').subtract(1, 'months'),
        dateTo: moment().endOf('month').subtract(1, 'months'),
      },
      {
        name: 'BY_LAST_YEAR',
        dateFrom: moment().startOf('year').subtract(1, 'years'),
        dateTo: moment().endOf('year').subtract(1, 'years'),
      },
      {
        name: 'BY_WHOLE_TIME',
        dateFrom: moment('01-01-2015', 'DD-MM-YYYY'),
        dateTo: moment().endOf('day')
      },
      {
        name: 'FROM_CALENDAR',
        dateFrom: null,
        dateTo: null
      }
    ];
    _.forEach(datePeriodArrLocal, (elem) => {
      this.translateService.get(elem.name).subscribe((res: string) => {
        elem.name = res;
      });
    });
    this.datePeriodArr = datePeriodArrLocal;
  };

  setValidDateTo(dateToInput) {
    let dateTo = moment(dateToInput).add(1, 'days').toDate(),
      validators = [
        Validators.required,
        CustomValidators.minDate(moment(dateToInput).format('YYYY-MM-DD'))
      ];
    this.minDateTo = dateTo;
    if (this.datePeriodForm.controls['dateTo'].value !== null &&
      this.datePeriodForm.controls['dateTo'].value <= this.datePeriodForm.controls['dateFrom'].value) {
      this.datePeriodForm.controls['dateTo'].setValue(dateTo);
    }
    this.datePeriodForm.controls['dateTo'].setValidators(Validators.compose(validators));
    this.datePeriodForm.controls['dateTo'].updateValueAndValidity();
  };

  changeDateFromTyped() {
    this.datePeriodForm.controls['dateFrom'].valueChanges
      .subscribe(date => {
        if (this.datePeriodForm.controls['dateFrom'].valid) {
          this.setValidDateTo(date);
        }
      });
  }

  datepickerPeriodIsSet() {
    this.noDataAlert = false;
    let dateFrom = this.datePeriodForm.controls['dateFrom'].value,
      dateTo = this.datePeriodForm.controls['dateTo'].value;
    this.dateFrom = moment(dateFrom).toISOString();
    this.dateTo = moment(dateTo).toISOString();
    this.chooseGetStatMethod(this.currentGetStatMethod);
  }
}
