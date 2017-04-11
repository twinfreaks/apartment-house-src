import {Component, OnInit} from "@angular/core";
import {Router, NavigationEnd, Event} from "@angular/router";
import {URLSearchParams} from "@angular/http";
import {AuthOauthService} from "app/oauth/services/auth-oauth.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AuthAppService} from "app/auth/services/auth-app.service";

@Component({
  selector: 'app-oauth-callback',
  templateUrl: 'oauth-callback.component.html',
  styleUrls: ['oauth-callback.component.scss']
})
export class OauthCallbackComponent implements OnInit {

  constructor(private router: Router,
              private authOauthService: AuthOauthService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private authAppService: AuthAppService) {
  }

  ngOnInit() {
    let isVerified = false;
    this.router.events.subscribe((event: Event) => {
      let params = new URLSearchParams(event["url"].split('#')[1]),
        accessToken = params.get('access_token');
      if (event instanceof NavigationEnd && isVerified === false) {
        isVerified = true;
        this.authOauthService.verifyOAuthToken(accessToken)
          .subscribe(
            (data) => {
              if (data.data.type === "REGISTERED") {
                this.authAppService.setLogin(data.data.token);
                this.toastrService.success(this.translateService.instant('SUCESS_LOGIN'), this.translateService.instant('LOGIN_NAME'));
                let roles = this.authAppService.getRoles();

                if (roles.length == 1) {
                  if (roles[0] == "superAdmin") {
                    this.router.navigate(['admin']);
                  }
                  else {
                    this.router.navigate(['user']);
                  }
                }
              }
              else {
                this.router.navigate(['registration']);
              }
            },
            (error) => {
              this.toastrService.error(this.translateService.instant("ERROR_OCCURED"));
            }
          )
      }
    });
  }
}
