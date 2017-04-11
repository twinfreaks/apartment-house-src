import {Routes} from "@angular/router";
import {OauthCallbackComponent} from "../oauth/oauth-callback/oauth-callback.component";

export const oAuthRoutes: Routes = [
  {
    path: 'oauth2callback',
    component: OauthCallbackComponent
  }
];
