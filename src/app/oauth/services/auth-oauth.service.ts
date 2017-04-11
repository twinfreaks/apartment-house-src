import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {AppConfig} from "app/app.config";

@Injectable()
export class AuthOauthService {

  readonly google = "google";
  readonly facebook = "fb";

  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  private queryString: any;
  private OathLoginEndPointUrl: string;
  private clientId: string;

  constructor(private http: Http,
              private config: AppConfig) {
  }

  getOAuthUrl(oauthServer: string) {
    switch (oauthServer) {
      case this.google:
        this.OathLoginEndPointUrl = this.config.getConfig('google.oAuthEndpoint');
        this.clientId = this.config.getConfig('google.clientId');
        this.queryString = {
          "client_id": this.clientId,
          "redirect_uri": this.config.getConfig('google.redirectUri'),
          "response_type": "token",
          "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          "include_granted_scopes": "true",
          "state": "pass-through value",
        };
        localStorage.setItem('oauthProvider', this.google);
        this.setQueryString(this.queryString, this.OathLoginEndPointUrl);

        break;

      case this.facebook:
        this.OathLoginEndPointUrl = this.config.getConfig('fb.oAuthEndpoint');
        this.clientId = this.config.getConfig('fb.clientId');
        this.queryString = {
          "client_id": this.clientId,
          "redirect_uri": this.config.getConfig('fb.redirectUri'),
          "response_type": "token",
          "scope": 'email'
        };
        localStorage.setItem('oauthProvider', this.facebook);
        this.setQueryString(this.queryString, this.OathLoginEndPointUrl);

        break;

    }
  }

  verifyOAuthToken(token: string) {
    localStorage.setItem("oauthToken", token);
    let oAuthServer = localStorage.getItem('oauthProvider');
    return this.http.post(this.config.getConfig('api') + `/oauthverify`, {
      token: token,
      oauthServer: oAuthServer
    }, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
        if (res.data.type === "NOT_FOUND") {
          localStorage.setItem("isOauthRegistration", "true");
          localStorage.setItem("oauthEmail", res.data.email);
        }
        return res;
      })
  }

  public setQueryString(queryString, oAuthEndpoint) {
    let urlParams = Object.keys(queryString).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(queryString[k])
    }).join('&');
    window.location.replace(oAuthEndpoint + "?" + urlParams);
  }

}
