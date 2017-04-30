import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {ProfileService} from '../services/profile.service';
import {AppConfig} from 'app/app.config';

@Component({
  selector: 'app-profile-menu',
  templateUrl: 'profile-menu.component.html',
  styleUrls: ['profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit, OnDestroy {
  private subscriptionUsername;
  private subscriptionIsLogin;
  photosUrl = this.config.getConfig('files') + '/userProfile/';
  username: string = '';
  isLoggedIn: boolean = false;
  role: string;
  isInhabitantActive: boolean;
  userphoto: any;
  inhabitantId: any;

  constructor(private authService: AuthAppService,
              private router: Router,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private authAppService: AuthAppService,
              private profileService: ProfileService,
              private config: AppConfig) {
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
      );

    this.role = this.authAppService.getRoles()[0];
    this.isInhabitantActive = this.authAppService.getIsInhabitantActive();
    this.authService.inhabitantIdSub.subscribe(
      (data) => {
        this.inhabitantId = data;
      }
    );
    this.getProfileById(this.inhabitantId);
  }

  getProfileById(id) {
    this.profileService.getProfileById(id)
      .subscribe(
        (data) => {
          this.userphoto = data.photo;
        }
      )
  }

  isInhabitant() {
    return this.role === "inhabitant";
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