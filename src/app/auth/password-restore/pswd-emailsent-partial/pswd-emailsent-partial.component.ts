import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {RestorePasswordService} from "app/auth/services/restore-password.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pswd-emailsent-partial',
  templateUrl: 'pswd-emailsent-partial.component.html'
})
export class PswdEmailsentPartialComponent implements OnInit {
  emailCodeForm: FormGroup;
  pswdCodeInstructionsEmailString: string;

  constructor(private formBuilder: FormBuilder,
              private restorePassword: RestorePasswordService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
    this.emailCodeForm = this.formBuilder.group({
      "code": [null, Validators.compose([Validators.required])]
    });

    this.translate.get("PSWD_CODE_INSTRUCTIONS_EMAIL")
      .subscribe((data) => {this.pswdCodeInstructionsEmailString = data});
  }

  emailCodeSend() {
    const code = this.emailCodeForm.value.code.replace(/[^0-9.]/g, "");
    this.restorePassword.checkCode(code)
      .subscribe(
        (data) => {
          if (data["code"] === 200) {
            this.toastr.success(this.translate.instant("RESTORE_PSWD_CODE_SUCCESS"));
            this.router.navigate(["passwordRestore/result", code]);
          }
          else if (data["code"] === 404) {
            this.toastr.warning(this.translate.instant("RESTORE_PSWD_CODE_NOT_FOUND"));
          }
          else {
            this.toastr.error(this.translate.instant("ERROR_OCCURED") + data["data"]);
          }
        },
        (error) => {
          this.toastr.error(this.translate.instant("ERROR_OCCURED") + error);
        }
      );
  }
}
