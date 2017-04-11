import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {CustomValidators} from "ng2-validation";
import {RestorePasswordService} from "app/auth/services/restore-password.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-pswd-restore-result-page',
  templateUrl: './pswd-restore-result-page.component.html'
})
export class PswdRestoreResultPageComponent implements OnInit {

  loaded: boolean = false;
  canChange: boolean = false;
  code: string;
  userDataForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private restorePassword: RestorePasswordService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.code = params["code"].replace(/[^0-9.]/g, "");
        this.restorePassword.checkCode(this.code)
          .subscribe(
            (data) => {
              switch (data["code"]) {
                case 200:
                  this.loaded = true;
                  this.canChange = true;
                  break;
                case 404:
                  this.loaded = true;
                  this.canChange = false;
                  break;
                default:
                  this.loaded = true;
                  this.canChange = false;
              }
            },
            (error) => {
              this.loaded = true;
              this.canChange = false;
            }
          );
      });
    let passwordControl = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(32)]));
    this.userDataForm = this.formBuilder.group({
      "password": passwordControl,
      "passwordRepeat": [null, Validators.compose([Validators.required, CustomValidators.equalTo(passwordControl)])]
    });
  }

  changePassword() {
    const userDataPass = this.userDataForm.value;
    userDataPass.code = this.code;
    this.restorePassword.changePassword(userDataPass)
      .subscribe(
        (data) => {
          if (data["code"] === 200) {
            this.toastr.success(this.translate.instant("SUCCESS_CHANGE_PASSWORD"));
            this.router.navigate(["login"]);
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
