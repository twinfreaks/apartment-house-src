import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {Building} from "app/shared/models/building.model";
import {CalculationType} from "app/shared/models/calculation-type.model";
import {BuildingService} from "app/shared/services/building.service";
import {CalculationService} from "app/shared/services/calculation.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AdminCalculation} from "../models/admin-calculation.model";
import {CalculationInhabitant} from "../models/calculation-inhabitant.model";
import {AppConfig} from "app/app.config";
import * as moment from "moment";
import * as _ from "lodash";

@Component({
  selector: 'app-admin-add-calculations',
  templateUrl: './admin-add-calculations.component.html',
  styleUrls: ['./admin-add-calculations.component.css']
})

export class AdminAddCalculationsComponent implements OnInit {
  @Input() building: Building = {streetName: '', buildingNumber: ''};
  @Input() typeOfCalculation: CalculationType = {name: '', description: '', icon: null};
  @Output() changeStep: EventEmitter<number> = new EventEmitter<number>();

  dateFormat: any = this.config.getConfig('dateFormat');
  inhabitants: CalculationInhabitant[] = [];
  allCalculations: AdminCalculation[] = [];
  calculations: AdminCalculation[] = [];

  constructor(private translateService: TranslateService,
              private calculationService: CalculationService,
              private buildingService: BuildingService,
              private toastrService: ToastrService,
              private config: AppConfig) {
  }

  ngOnInit() {
    this.calculationService.getInhabitantsDebts(this.building, this.typeOfCalculation)
      .subscribe(
        (data) => {
          this.inhabitants = data.inhabitants;
          this.initCalculations()
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      )
  }

  emitChangeStep(step: number) {
    this.changeStep.emit(step);
    return false;
  }

  initCalculations() {
    let inhabitantId: number,
      t = this;
    _.forEach(t.inhabitants, function (inhabitant, index) {
      inhabitantId = inhabitant.id;
      t.calculations[index] = {
        calculationType: t.typeOfCalculation.id,
        inhabitant: inhabitantId,
        date: moment().toISOString(),
        toPayAmount: '',
        payedAmount: '',
        debt: 0,
        beginToPay: false,
        beginPayed: false,
        valid: false,
        saved: false,
        appartment: t.getInhabitantApartment(inhabitantId),
        inhabitantName: t.getInhabitantName(inhabitantId),
        prevDebt: t.getInhabitantDebt(inhabitantId),
        prevDate: t.getLastDate(inhabitantId)
      }
    });
    t.calculations = _.orderBy(t.calculations, 'inhabitantName', 'asc');
    t.allCalculations = t.calculations;
  }

  setCalculationsAfterSave(data) {
    let t = this;
    t.calculations = data;
    _.forEach(t.calculations, function (calculation, index) {
      calculation.inhabitantName = t.getInhabitantName(calculation.inhabitant);
      calculation.appartment = t.getInhabitantApartment(calculation.inhabitant);
      calculation.prevDebt = t.getInhabitantDebt(calculation.inhabitant);
      calculation.prevDate = t.getLastDate(calculation.inhabitant);
      t.successSave(calculation);
    });
    t.calculations = _.orderBy(t.calculations, 'inhabitantName', 'asc');
  }

  successSave(calculation) {
    _.forEach(this.allCalculations, function (calc) {
      (calc.inhabitant === calculation.inhabitant) ? calc.saved = true : calc.saved;
    });
    _.forEach(this.allCalculations, function (calc) {
      (calc.inhabitant === calculation.inhabitant) ? calc.id = calculation.id : calc.saved;
    });
    calculation.saved = true;
    calculation.beginToPay = false;
    calculation.beginPayed = false;
  }

  saveAllCalculations() {
    _.forEach(this.calculations, function (calculation) {
      calculation.debt = parseFloat(calculation.prevDebt) + parseFloat(calculation.toPayAmount) - parseFloat(calculation.payedAmount);
    });
    this.calculationService.postCalculationsArray(this.calculations)
      .subscribe(
        (data) => {
          this.setCalculationsAfterSave(data);
          this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('CALCULATIONS_SAVED'));
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      )
  }

  saveCalculation(calculation) {
    if (!calculation.saved) {
      calculation.debt = this.calculateDebt(calculation.prevDebt, calculation.toPayAmount, calculation.payedAmount);
      this.calculationService.postCalculation(calculation)
        .subscribe(
          (data) => {
            calculation.id = data.id;
            this.successSave(calculation);
            this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('CALCULATIONS_SAVED'));
          },
          (err) => {
            this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
          }
        )
    } else {
      calculation.debt = this.calculateDebt(calculation.prevDebt, calculation.toPayAmount, calculation.payedAmount);
      this.calculationService.editCalculation(calculation)
        .subscribe(
          (data) => {
            calculation.id = data[0].id;
            this.successSave(calculation);
            this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('CALCULATIONS_SAVED'));
          },
          (err) => {
            this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
          }
        )
    }

  }

  checkValidity(value) {
    let reg1 = new RegExp('^[0-9.]+$'),
      reg2 = new RegExp('.*[0-9].*');
    return reg1.test(value) && reg2.test(value);
  }

  checkDisabled(toPay, payed, calculation) {
    if (!this.checkValidity(toPay) || !this.checkValidity(payed)) {
      calculation.valid = false;
      return true;
    } else if (!(calculation.beginPayed || calculation.beginToPay)) {
      calculation.valid = true;
      return true;
    }
    calculation.valid = true;
    return false;
  }

  checkAllValidity() {
    let valid = false;
    _.forEach(this.calculations, function (calclulation, index) {
      if (calclulation.valid == false) {
        valid = true;
        return;
      }
    });
    return valid;
  }

  getInhabitantName(id: number): string {
    let result: string;
    _.forEach(this.inhabitants, function (inhabitant, index) {
      (inhabitant.id === id) ? result = inhabitant.surname + ' ' + inhabitant.name + ' ' + inhabitant.patronymic : '';
    });
    return result;
  }

  getInhabitantApartment(id: number): string {
    let result: string;
    _.forEach(this.inhabitants, function (inhabitant, index) {
      (inhabitant.id === id) ? result = inhabitant.appartment : '';
    });
    return result;
  }

  getInhabitantDebt(id: number): string {
    let result: string = '0';
    _.forEach(this.inhabitants, function (inhabitant, index) {
      (typeof inhabitant.lastCalculation !== 'undefined' && inhabitant.id === id) ? result = inhabitant.lastCalculation.debt : '';
    });
    return result;
  }

  getLastDate(id: number): string {
    let result: string = '',
      t = this;
    _.forEach(this.inhabitants, function (inhabitant, index) {
      if (typeof inhabitant.lastCalculation !== 'undefined' && inhabitant.id === id) {
        result = moment(inhabitant.lastCalculation.date).format();
      }
    });
    return result;
  }

  displayLastDate(date): string {
    let result: string;
    if (date === '') {
      return this.translateService.instant('NO_PREV_INPUT');
    }
    if (moment().isSame(moment(date), 'day')) {
      return this.translateService.instant('TODAY');
    }
    if (moment().diff(moment(date), 'days') === 1) {
      return this.translateService.instant('YESTERDAY');
    }
    return moment(date).format(this.dateFormat.dateSlash);
  }

  calculateDebt(prevDebt, toPayAmount, payedAmount): number {
    return parseFloat(prevDebt) + (parseFloat(toPayAmount) - parseFloat(payedAmount));
  }

  search(value) {
    let t = this;
    if (value.length < 2) {
      t.calculations = t.allCalculations;
      return;
    }
    t.calculations = _.filter(t.allCalculations, function (calculation) {
      return calculation.inhabitantName.toLowerCase().match(value.toLowerCase());
    });
  }
}
