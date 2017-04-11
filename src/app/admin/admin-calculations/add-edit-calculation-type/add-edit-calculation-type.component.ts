import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from "@angular/core";
import {CalculationType} from "app/shared/models/calculation-type.model";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {AppConfig} from "app/app.config";
import * as _ from "lodash";

@Component({
  selector: 'app-add-edit-calculation-type',
  templateUrl: './add-edit-calculation-type.component.html',
  styleUrls: ['./add-edit-calculation-type.component.css']
})
export class AddEditCalculationTypeComponent implements OnInit {
  @Input() calculationType: CalculationType = null;
  @Output() updateCalculationType: EventEmitter<CalculationType> = new EventEmitter<CalculationType>();
  @Output() cancel: EventEmitter<CalculationType> = new EventEmitter<CalculationType>();
  newCalculationType: CalculationType;
  uploadDestination: string = 'calculation-types';
  imageUrl = `${this.config.getConfig('api')}/${this.uploadDestination}`;
  uploadUrl = `${this.config.getConfig('api')}/upload`;
  uploaded: boolean = false;
  imageName: string;

  constructor(public translateService: TranslateService,
              private config: AppConfig,
              private toastrService: ToastrService,) {
  }

  ngOnInit() {
    this.newCalculationType = (this.calculationType) ? this.calculationType : this.newCalculationType = {
        name: '',
        description: '',
        icon: null
      };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.newCalculationType = (changes['calculationType'] && this.calculationType) ? this.calculationType : this.newCalculationType;
  }

  setNewCalculationType(property: string, value: any) {
    this.newCalculationType[property] = value;
  }

  onSubmit() {
    let typeToEmit;
    if (this.calculationType && this.calculationType.id) {
      typeToEmit = this.calculationType;
      _.forOwn(this.newCalculationType, function (value, key) {
        typeToEmit[key] = value;
      });
    } else {
      typeToEmit = this.newCalculationType;
    }
    this.updateCalculationType.emit(typeToEmit);
    return false;
  }

  emitCancel() {
    this.cancel.emit(this.newCalculationType);
  }

  addDestination(formData) {
    formData.append('destination', this.uploadDestination);
  }

  onUpload(event) {
    this.uploaded = true;
    let res = JSON.parse(event.response)[0];
    this.imageName = res.filename;
    this.setNewCalculationType('icon', this.imageName);
    this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('SUCCESS_UPLOAD_IMAGE'));
  }
}
