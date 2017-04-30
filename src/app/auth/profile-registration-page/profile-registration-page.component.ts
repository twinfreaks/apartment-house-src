import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import * as _ from "lodash";
import {CustomValidators} from "ng2-validation";
import {ToastrService} from "ngx-toastr";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {BuildingService} from "app/shared/services/building.service";
import {TranslateService} from "@ngx-translate/core";
import {ValidationService} from "app/core/validation-messages/validation.service";
import {BuildingsRegistrationService} from "../services/buildings-registration.service";

@Component({
  selector: 'app-profile-registration',
  templateUrl: 'profile-registration-page.component.html',
  styleUrls: ['profile-registration-page.component.css']
})

export class ProfileRegistrationPageComponent implements OnInit {
  registrationForm: FormGroup;
  loading: boolean;
  created: boolean;
  buildings: any;
  formSteps: Array<string>;
  formStep: number = 1;
  canNext: boolean = true;
  canPrev: boolean = false;
  registrationType: string = "native";
  oAuthEmail: string = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthAppService,
              private toastrService: ToastrService,
              private buildingService: BuildingsRegistrationService,
              private translateService: TranslateService) {
    this.loading = false;
    this.created = false;
    this.formSteps = [this.translateService.instant("INHABITANT_DATA"), this.translateService.instant("SETTING_PASSWORD")]
  }

  ngOnInit() {
    if (localStorage.getItem("isOauthRegistration") !== null) {
      this.registrationType = "oAuth";
      this.oAuthEmail = localStorage.getItem("oauthEmail");
      this.formSteps = [this.translateService.instant("INHABITANT_DATA")];
    }
    this.buildingService.getAll()
      .subscribe(
        (buildings) => {
          function select2Refactor(building) {
            return {"id": building.id, "text": building.streetName + " " + building.buildingNumber};
          }
          this.buildings = _.map(buildings, select2Refactor);
        },
        (err) => {
          this.toastrService.error(this.translateService.instant("ERROR_OCCURED") + err);
        }
      );
    let passwordControl = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(32)]));
    let buildingControl = new FormControl(null, Validators.required);
    this.registrationForm = this.formBuilder.group({
      inhabitant: this.formBuilder.group({
        'building': buildingControl,
        'appartment': [null, Validators.required, ValidationService.buildingExist(this.authService, buildingControl)],
        'surname': [null, Validators.required],
        'name': [null, Validators.required],
        'patronymic': [null, Validators.required],
        'email': [this.oAuthEmail, Validators.compose([Validators.required, CustomValidators.email]), ValidationService.emailExist(this.authService)],
        'phone': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)]), ValidationService.phoneExist(this.authService, 0)]
      })
    });
    if (this.registrationType === "native") {
      let userData = this.formBuilder.group({
        "password": passwordControl,
        "passwordRepeat": [null, Validators.compose([Validators.required, CustomValidators.equalTo(passwordControl)])]
      });
      this.registrationForm.addControl("userData", userData);
    }
  }

  setStep(step) {
    this.formStep = step;
    this.canNext = true;
    this.canPrev = true;
    this.canNext =!(step === this.formSteps.length);
    this.canPrev =!(step === 1)
  }

  saveRegistration() {
    this.loading = true;
    let registrationUserData = this.registrationForm.value;
    registrationUserData.registrationType = this.registrationType;
    this.authService.registrate(registrationUserData)
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.created = true;
          this.toastrService.success(this.translateService.instant("SUCCESSFUL_REGISTRATION"));
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
        }
      );
  }
}
