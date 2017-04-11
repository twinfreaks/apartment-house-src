import {Component, Input} from "@angular/core";
import {FormControl} from "@angular/forms";
import {ValidationService} from "app/core/validation-messages/validation.service";

@Component({
  selector: 'app-validation-messages',
  template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ValidationMessagesComponent {

  @Input() control: FormControl;
  @Input() errors?: Object;

  constructor(private validationService: ValidationService) {
  }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        if (typeof this.errors === 'undefined') {
          return this.validationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        }
          return this.errors[propertyName];
      }
    }
    return null;
  }

}
