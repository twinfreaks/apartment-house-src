import {Component, OnInit, Output, EventEmitter, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "ng2-validation";
import {AppConfig} from "../../../app.config";
import {ReCaptchaComponent} from "angular2-recaptcha/lib/captcha.component";
import {RestorePasswordService} from "app/auth/services/restore-password.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {RestoreByEmail} from "app/auth/restore-by-email.model";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-pswd-restore-email-partial',
  templateUrl: 'pswd-restore-email-partial.component.html'
})
export class PswdRestoreEmailPartialComponent implements OnInit {

  @Output()
  chooseEmailSent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  restoreEmailForm: FormGroup;
  reCaptchaSiteKey: string;
  saving: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private appConfig: AppConfig,
              private restorePassword: RestorePasswordService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private languageTranslate: LanguageTranslateService) {
  }

  ngOnInit() {
    this.reCaptchaSiteKey = this.appConfig.getConfig("reCaptchaSiteKey");

    this.restoreEmailForm = this.formBuilder.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      'recaptcha': [null, Validators.required]
    });
  }

  sendRestoreEmail() {
    this.saving = true;
    const restoreByEmailData: RestoreByEmail = {
      "email": this.restoreEmailForm.value.email,
      "recaptcha": this.restoreEmailForm.value.recaptcha,
      "type": "byEmail",
      "lang": this.languageTranslate.getCurrentLanguage()
    };
    this.restorePassword.restoreByEmail(restoreByEmailData)
      .subscribe(
        (data) => {
          if (data["code"] === 200) {
            this.toastr.success(this.translate.instant("SUCCESS_SENT_EMAIL"));
            this.chooseEmailSent.emit("emailSent");
          }
          else {
            this.toastr.warning(this.translate.instant("EMAIL_NOT_FOUND"));
            this.captcha.reset();
          }
        },
        (err) => {
          this.toastr.error(this.translate.instant("ERROR_OCCURED") + " " + err);
        }
      );
  }

  isCorrectCaptcha(event) {
    this.restoreEmailForm.patchValue({recaptcha: <any>event});
    this.restoreEmailForm.controls['recaptcha'].updateValueAndValidity();
  }

}
