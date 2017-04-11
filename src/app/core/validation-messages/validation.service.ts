import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {AbstractControl} from "@angular/forms";

@Injectable()
export class ValidationService {

  constructor(private translateService: TranslateService) {
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': this.translateService.instant('REQUIRED_FIELD'),
      'minlength': this.translateService.instant('FIELD_TOO_SHORT'),
      'maxlength': this.translateService.instant('FIELD_TOO_LONG'),
      'email': this.translateService.instant("EMAIL_NOT_VALID"),
      'uniqueEmail': this.translateService.instant("EMAIL_ALREADY_EXIST"),
      'uniquePhone': this.translateService.instant("PHONE_NUMBER_ALREADY_USED"),
      'uniqueUsername': this.translateService.instant("USER_ALREADY_USED"),
      'equalTo': this.translateService.instant("PASSWORDS_DOESNT_COINCIDE")
    };
    return config[validatorName];
  }

  // Custom validators used in different parts of application.
  static usernameExist(service: any, userId: number): any {
    return (control: AbstractControl): {[key: string]: any} => {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        service.serverValidation(control.value, 'username', userId)
          .subscribe(
            (res) => {
              if (res.data) {
                resolve(null);
                return;
              }
              else {
                resolve({uniqueUsername: true});
                return;
              }
            },
            (err) => {
              resolve({uniqueUsername: true});
            }
          );
      });
    };
  }

  static emailExist(service: any): any {
    return (control: AbstractControl): {[key: string]: any} => {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        service.serverValidation(control.value, 'email')
          .subscribe(
            (res) => {
              if (res.data) {
                resolve(null);
                return;
              }
              else {
                resolve({uniqueEmail: true});
                return;
              }
            },
            (err) => {
              resolve({uniqueEmail: true});
            }
          );
      });
    };
  }

  static phoneExist(service: any): any {
    return (control: AbstractControl): {[key: string]: any} => {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        let checkVal = control.value.replace(/[^0-9.]/g, "");
        service.serverValidation(checkVal, 'phone')
          .subscribe(
            (res) => {
              if (res.data) {
                resolve(null);
                return;
              }
              else {
                resolve({uniquePhone: true});
                return;
              }
            },
            (err) => {
              resolve({uniquePhone: true});
            }
          );
      });
    };
  }

  static buildingExist(service: any, addValue?: any): any {
    return (control: AbstractControl): {[key: string]: any} => {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise((resolve, reject) => {
        service.serverValidation(control.value, 'building', addValue.value)
          .subscribe(
            (res) => {
              if (res.data) {
                resolve(null);
                return;
              }
              else {
                resolve({uniqueBuilding: true});
                return;
              }
            },
            (err) => {
              resolve({uniqueBuilding: true});
            }
          );
      });
    };
  }

}
