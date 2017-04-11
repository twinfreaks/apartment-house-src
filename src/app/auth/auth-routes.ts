import {Routes} from "@angular/router";
import {ProfileEditComponent} from "app/user/profile/profile-edit/profile-edit.component";
import {AuthLoginPageComponent} from "app/auth/auth-login-page/auth-login-page.component";
import {ProfileRegistrationPageComponent} from "app/auth/profile-registration-page/profile-registration-page.component";
import {PswdRestorePageComponent} from "app/auth/password-restore/pswd-restore-page/pswd-restore-page.component";
import {PswdRestoreResultPageComponent} from "app/auth/password-restore/pswd-restore-result-page/pswd-restore-result-page.component";

export const authRoutes: Routes = [
  {
    path: 'profile',
    component: ProfileEditComponent
  },
  {
    path: 'login',
    component: AuthLoginPageComponent
  },
  {
    path: 'registration',
    component: ProfileRegistrationPageComponent
  },
  {
    path: 'passwordRestore',
    component: PswdRestorePageComponent
  },
  {
    path: 'passwordRestore/result/:code',
    component: PswdRestoreResultPageComponent
  }
];
