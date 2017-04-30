import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import {CustomValidators} from "ng2-validation";
import {ValidationService} from "app/core/validation-messages/validation.service";
import {AuthAppService} from "../../../auth/services/auth-app.service";
import {SettingsService} from "../../../core/settings.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
  @ViewChild('lgModal') modal: ModalDirective;
  changePasswordForm: FormGroup;
  loading: boolean = false;
  isPreviousPassword: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthAppService,
              private settingsService: SettingsService,
              private toastr: ToastrService,
              public translate: TranslateService) { }

  ngOnInit() {
    let previousPassword = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(32)]), ValidationService.passwordCorrect(this.authService));
    let passwordControl = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(32)]));
    this.changePasswordForm = this.formBuilder.group({
      "password": passwordControl,
      "passwordRepeat": [null, Validators.compose([Validators.required, CustomValidators.equalTo(passwordControl)])]
    });

    this.authService.isOAuthSub.subscribe(
      (isOAuth) => {
        if (isOAuth === false) {
          this.isPreviousPassword = true;
          this.changePasswordForm.addControl("previousPassword", previousPassword);
        }
      }
    )
  }

  openPasswordChange(){
    this.modal.show();
  }

  saveChangePassword() {
    this.loading = true;
    this.settingsService.changePassword(this.changePasswordForm.value)
      .subscribe(
        () => {
          this.toastr.success(this.translate.instant("PASSWORD_SUCCESSFULLY_CHANGED"));
          this.changePasswordForm.reset();
          this.modal.hide();
        },
        (error) => {
          this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
        }
      )
  }

}
