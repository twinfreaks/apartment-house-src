import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

import {TranslateService} from "@ngx-translate/core";
import {AuthAppService} from "app/auth/services/auth-app.service";

@Component({
  selector: 'app-profile-menu',
  templateUrl: 'profile-menu.component.html',
  styleUrls: ['profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit, OnDestroy {
  private subscriptionUsername;
  private subscriptionIsLogin;
  username: string = '';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthAppService,
              private router: Router,
              private toastrService: ToastrService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.subscriptionUsername = this.authService.usernameSub
      .subscribe(
        (res: string) => {
          this.username = res;
        }
      );

    this.subscriptionIsLogin = this.authService.loggedInSub
      .subscribe(
        (res: boolean) => {
          this.isLoggedIn = res;
        }
      )
  }

  ngOnDestroy() {
    this.subscriptionIsLogin.unsubscribe();
    this.subscriptionUsername.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.toastrService.info(this.translateService.instant("LOGOUT_SUCCESS"), this.translateService.instant("LOGOUT"));
    this.router.navigate(['login']);
  }
}