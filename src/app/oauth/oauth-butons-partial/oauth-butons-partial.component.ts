import {Component} from "@angular/core";
import {AuthOauthService} from "app/oauth/services/auth-oauth.service";

@Component({
  selector: 'app-oauth-butons-partial',
  templateUrl: './oauth-butons-partial.component.html',
  styleUrls: ['./oauth-butons-partial.component.scss']
})
export class OauthButonsPartialComponent {

  constructor(private oauthService: AuthOauthService) {
  }

  oAuthLogin(oauthServer: string) {
    this.oauthService.getOAuthUrl(oauthServer);
  }

}
