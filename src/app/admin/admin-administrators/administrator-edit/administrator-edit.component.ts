import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {CustomValidators} from "ng2-validation";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {RolesService} from "../roles.service";
import {ToastrService} from "ngx-toastr";
import * as _ from "lodash";
import {AdministratorsService} from "../administrators.service";
import {AuthAppService} from "../../../auth/services/auth-app.service";
import {ValidationService} from "../../../core/validation-messages/validation.service";

@Component({
  selector: 'app-administrator-edit',
  templateUrl: './administrator-edit.component.html'
})
export class AdministratorEditComponent implements OnInit {
  administratorForm: FormGroup;
  id: number;
  title: string = '';
  roles: Array<any>;
  changePassword: boolean = true;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private translateService: TranslateService,
              private rolesService: RolesService,
              private authService: AuthAppService,
              private toastrService: ToastrService,
              private administratorsService: AdministratorsService) {
  }

  ngOnInit() {
    this.rolesService.getAll()
      .subscribe(
        (buildings) => {
          function select2Refactor(role) {
            return {"id": role.id, "text": role.name + " (" + role.description + ")"};
          }
          this.roles = _.map(buildings, select2Refactor);
        },
        (err) => {
          this.toastrService.error(this.translateService.instant("ERROR_OCCURED") + err);
        }
      );

    let roleControl = new FormControl(null, Validators.required);
    this.administratorForm = this.formBuilder.group({
      'surname': [null, Validators.required],
      'name': [null, Validators.required],
      'patronymic': [null, Validators.required],
      'username': [null, Validators.required, ValidationService.usernameExist(this.authService, 0)],
      'createPassword': [true],
      'role': roleControl
    });

    this.route.params
      .subscribe(params => {
        this.id = params["id"];
        if (typeof this.id !== 'undefined') {
          this.administratorsService.get(this.id)
            .subscribe(
              (data) => {
                const editFormData = {
                  "surname": data["surname"],
                  "name": data["name"],
                  "patronymic": data["patronymic"],
                  "username": data["username"],
                  "createPassword": false,
                  "role": [{
                    "id": data["roleId"],
                    "text": data["roleName"]
                  }],
                  "userData": {
                    "password": '',
                    "passwordRepeat": ''
                  }
                };
                (<FormGroup>this.administratorForm).setValue(editFormData, {onlySelf: true});
                this.administratorForm.controls['username'].setValidators(Validators.required);
                this.administratorForm.controls['username'].setAsyncValidators(ValidationService.usernameExist(this.authService, data["userId"]));

                this.administratorForm.updateValueAndValidity();
              },
              (err) => {
                this.toastrService.error(this.translateService.instant("ERROR_OCCURED") + err);
              }
            );

          this.translateService.get("EDIT_ADMINISTRATOR").subscribe(
            (data) => {
              this.title = data;
            }
          );
          this.addChangePass();
        }
        else {
          this.translateService.get("ADD_ADMINISTRATOR").subscribe(
            (data) => {
              this.title = data;
            }
          );
          this.addChangePass();
        }
      });
    this.isPassword();
  }

  isPassword() {
    this.administratorForm.valueChanges
      .debounceTime(60)
      .distinctUntilChanged()
      .subscribe(event => {
        this.changePassword = event.createPassword;
        this.addChangePass();
      })
  }

  addChangePass() {
    if (this.changePassword) {
      let passwordControl = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(32)]));
      let userData = this.formBuilder.group({
        "password": passwordControl,
        "passwordRepeat": [null, Validators.compose([Validators.required, CustomValidators.equalTo(passwordControl)])]
      });
      this.administratorForm.addControl("userData", userData);
    }
    else {
      this.administratorForm.removeControl("userData");
    }
    this.administratorForm.updateValueAndValidity();
  }

  saveAdmin() {
    const adminFormData = this.administratorForm.value;
    adminFormData.role = adminFormData.role[0].id;
    if (typeof adminFormData.userData !== "undefined") {
      adminFormData.password = adminFormData.userData.password;
      adminFormData.passwordRepeat = adminFormData.userData.passwordRepeat;
    }

    if (typeof this.id !== 'undefined') {
      this.administratorsService.update(adminFormData, this.id)
        .subscribe(
          (data) => {
            this.toastrService.success(this.translateService.instant("CHANGES_SAVED"));
            this.router.navigate(['/admin/administrators']);
          },
          (err) => {
            this.toastrService.error(this.translateService.instant("ERROR_OCCURED") + err);
          }
        );
    }
    else {
      this.administratorsService.save(adminFormData)
        .subscribe(
          (data) => {
            this.toastrService.success(this.translateService.instant("CHANGES_SAVED"));
            this.router.navigate(['/admin/administrators']);
          },
          (err) => {
            this.toastrService.error(this.translateService.instant("ERROR_OCCURED") + err);
          }
        );
    }
  }
}