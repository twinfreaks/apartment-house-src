import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {CalculationService} from "app/shared/services/calculation.service";
import {CalculationType} from "app/shared/models/calculation-type.model";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService} from "primeng/primeng";
import {AppConfig} from "app/app.config";
import * as _ from "lodash";

@Component({
  selector: 'app-admin-choose-calculation-type',
  templateUrl: './admin-choose-calculation-type.component.html',
  styleUrls: ['./admin-choose-calculation-type.component.scss']
})
export class AdminChooseCalculationTypeComponent implements OnInit {
  @Input() choosenType: CalculationType = null;
  @Output() changeStep: EventEmitter<number> = new EventEmitter<number>();
  @Output() chooseCalculationType: EventEmitter<CalculationType> = new EventEmitter<CalculationType>();

  imageUrl = `${this.config.getConfig('files')}/calculation-types`;
  choosen: number;
  addType: boolean = false;
  calculationTypes: CalculationType[] = [];
  activeTypes: CalculationType[] = [];
  activeType: CalculationType = null;

  constructor(private calculationService: CalculationService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private confirmationService: ConfirmationService,
              private config: AppConfig) {
  }

  ngOnInit() {
    (this.choosenType) ? this.choosen = this.choosenType.id : this.choosen = 0;
    this.calculationService.getRelevantTypes()
      .subscribe(
        (data) => {
          this.calculationTypes = data;
          this.calculationTypes = _.orderBy(this.calculationTypes, 'name', 'ASC');
          this.activeTypes = this.calculationTypes;
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      )
  }

  emitChooseType(id: number) {
    this.choosen = id;
    this.chooseCalculationType.emit(this.findTypeById(id));
  }

  emitChangeStep(step: number) {
    this.changeStep.emit(step);
  }

  findTypeById(id: number): CalculationType {
    for (let i = 0; i < this.calculationTypes.length; i++) {
      if (this.calculationTypes[i].id == id) {
        return this.calculationTypes[i];
      }
    }
    return null;
  }

  updateCalculationType(type: CalculationType) {
    this.addType = false;
    if(typeof type.id !== 'undefined'){
      this.calculationService.editType(type)
      .subscribe(
        (data) => {
          _.forEach(this.calculationTypes, (type, index) => {
            if(type.id == data[0].id){
              this.calculationTypes[index] = data[0];
            }
          })
          this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('SUCCESS_EDIT_TYPE'));
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      );
    } else {
      this.calculationService.postType(type)
      .subscribe(
        (data) => {
          this.calculationTypes.push(data);
          this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('SUCCESS_ADD_TYPE'));
        },
        (err) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      );
    }
  }

  search(value) {
    let t = this;
    if (value.length < 1) {
      t.activeTypes = t.calculationTypes;
      return;
    }
    t.activeTypes = _.filter(t.calculationTypes, function (type) {
      return type.name.toLowerCase().match(value.toLowerCase());
    });
  }

  editType(type){
    this.activeType = Object.assign({}, type); 
    this.addType = true;
  }

  deleteType(type){
    this.confirmationService.confirm({
        message: this.translateService.instant("CONFIRM_DELETE_CALCULATION_TYPE")  + ' ' + type.name + '?',
        accept: () => {
          this.calculationService.deleteCalculationType(type)
          .subscribe(
            (data) => {
              this.chooseCalculationType.emit(null);
              this.choosen = null;
              this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('SUCCESS_DELETE_TYPE'));
              _.forEach(this.calculationTypes, (calculation, index) => {
                if(calculation.id === type.id){
                  this.calculationTypes.splice(index, 1);
                  return false;
                }
              });
              this.activeTypes = this.calculationTypes;
            },
            (err) => {
              this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
            }
          );
        }
      });
  }

}
