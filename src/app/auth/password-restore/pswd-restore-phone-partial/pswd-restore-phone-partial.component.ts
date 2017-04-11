import {Component, OnInit, Output, EventEmitter, ViewChild} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AppConfig} from "../../../app.config";
import {ReCaptchaComponent} from "angular2-recaptcha/lib/captcha.component";
import {RestoreByPhone} from "app/auth/restore-by-phone.model";
import {RestorePasswordService} from "app/auth/services/restore-password.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-pswd-restore-phone-partial',
  templateUrl: 'pswd-restore-phone-partial.component.html'
})
export class PswdRestorePhonePartialComponent implements OnInit {

  @Output()
  chooseEmailSent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(ReCaptchaComponent)
  captcha: ReCaptchaComponent;

  reCaptchaSiteKey: string;
  restorePhoneForm: FormGroup;
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
    this.restorePhoneForm = this.formBuilder.group({
      'phone': [null, Validators.compose([Validators.required])],
      'recaptcha': [null, Validators.required]
    });
  }

  sendRestoreEmail() {
    this.saving = true;
    const restoreByPhoneData: RestoreByPhone = {
      "phone": this.restorePhoneForm.value.phone.replace(/[^0-9.]/g, ""),
      "recaptcha": this.restorePhoneForm.value.recaptcha,
      "type": "byPhone",
      "lang": this.languageTranslate.getCurrentLanguage()
    };
    this.restorePassword.restoreByPhone(restoreByPhoneData)
      .subscribe(
        (data) => {
          if (data["code"] === 200) {
            this.toastr.success(this.translate.instant("SUCCESS_PHONE_FOUND"));
            this.chooseEmailSent.emit("phoneSent");
          }
          else {
            this.toastr.warning(this.translate.instant("PHONE_NOT_FOUND"));
            this.captcha.reset();
          }
        },
        (err) => {
          this.toastr.error(this.translate.instant("ERROR_OCCURED") + " " + err);
        }
      );
  }

  isCorrectCaptcha(event) {
    this.restorePhoneForm.patchValue({recaptcha: <any>event});
    this.restorePhoneForm.controls['recaptcha'].updateValueAndValidity();
  }

}
