import {Component, OnInit} from "@angular/core";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-auth-login',
  templateUrl: 'auth-login-page.component.html',
  styleUrls: ['auth-login-page.component.css']
})
export class AuthLoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthAppService,
              private toastrService: ToastrService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    let roles = this.authService.getRoles();
    if (this.authService.isLoggedIn()) {
      if (roles.indexOf('inhabitant') != -1) {
        this.router.navigate(['user']);
      }
      else if (roles.indexOf('superAdmin') != -1 || roles.indexOf('adminBlog') != -1 || roles.indexOf('adminAccountant') != -1) {
        this.router.navigate(['admin']);
      }
    }
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required])]
    });
  }

  login() {
    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe(
        (res: any) => {
          this.loading = false;
          if (res.code == 200) {
            this.toastrService.success(this.translateService.instant('SUCESS_LOGIN'), this.translateService.instant('LOGIN_NAME'));
            let roles = this.authService.getRoles();
            if (roles.length == 1) {
              if (roles[0] === "superAdmin" || roles[0] === "adminBlog" || roles[0] === "adminAccountant") {
                this.router.navigate(['admin']);
              }
              else {
                this.router.navigate(['user']);
              }
            }
            else {
              this.toastrService.warning(this.translateService.instant("MUST_PROVIDE_ROLES"));
            }
          }
          else if (res.code == 404) {
            this.toastrService.warning(this.translateService.instant("WRONG_USERNAME"), this.translateService.instant("LOGIN_NAME"));
          }
          else {
            this.toastrService.warning(this.translateService.instant("WRONG_PASSWORD"), this.translateService.instant("LOGIN_NAME"));
          }
        },
        (err) => {
          this.toastrService.error(err, this.translateService.instant("ERROR_OCCURED"));
        }
      );
  }
}
