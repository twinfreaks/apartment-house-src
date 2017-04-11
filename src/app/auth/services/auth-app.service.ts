import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs";
import {Subject, BehaviorSubject} from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {JwtHelper} from "angular2-jwt";
import {AppConfig} from "../../app.config";
import {UserData} from "../user-data.model";

@Injectable()
export class AuthAppService {

  headers = new Headers({'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

  private username: string;
  private userId: string;
  private loggedIn: boolean = false;
  private roles: any;
  private adminId: number = null;
  private inhabitantId: number = null;
  private isInhabitantActive: boolean = false;

  public usernameSub: Subject<string> = new BehaviorSubject<string>(null);
  public userIdSub: Subject<string> = new BehaviorSubject<string>(null);
  public loggedInSub: Subject<boolean> = new BehaviorSubject<boolean>(null);
  public rolesSub: Subject<any> = new BehaviorSubject<any>(null);
  public adminIdSub: Subject<any> = new BehaviorSubject<any>(null);
  public inhabitantIdSub: Subject<any> = new BehaviorSubject<any>(null);
  public isInhabitantActiveSub: Subject<boolean> = new BehaviorSubject<boolean>(null);

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private config: AppConfig) {
    this.loggedIn = (localStorage.getItem('logged_in') == 'true');
    this.username = localStorage.getItem("username");
    this.userId = localStorage.getItem("userId");
    this.roles = (localStorage.getItem("roles") != null) ? localStorage.getItem("roles").split(',') : null;
    this.adminId = parseInt(localStorage.getItem("adminId"));
    this.inhabitantId = parseInt(localStorage.getItem("inhabitantId"));
    this.isInhabitantActive = (localStorage.getItem("isInhabitantActive") == 'true');

    this.usernameSub.next(localStorage.getItem("username"));
    this.userIdSub.next(localStorage.getItem("userId"));
    this.loggedInSub.next((localStorage.getItem('logged_in') == 'true'));
    this.rolesSub.next((localStorage.getItem("roles") != null) ? localStorage.getItem("roles").split(',') : null);
    this.adminIdSub.next(parseInt(localStorage.getItem("adminId")));
    this.inhabitantIdSub.next(parseInt(localStorage.getItem("inhabitantId")));
    this.isInhabitantActiveSub.next((localStorage.getItem("isInhabitantActive") == 'true'));
  }

  login(userData: UserData): Observable<Response> {
    return this.http.post(this.config.getConfig('api') + `/login`, userData, this.options)
      .map((res: Response) => res.json())
      .map((res) => {
        if (res.code == 200) {
          this.setLogin(res.token);
        }
        return res;
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  setLogin(token): void {
    localStorage.setItem('id_token', token);
    localStorage.setItem('logged_in', 'true');

    let decodedToken = this.jwtHelper.decodeToken(token);

    this.usernameSub.next(decodedToken.username);
    this.userIdSub.next(decodedToken.sub);
    this.rolesSub.next(decodedToken.roles);
    this.loggedInSub.next(true);
    this.adminIdSub.next(decodedToken.admin);
    this.inhabitantIdSub.next(decodedToken.inhabitant);
    this.isInhabitantActiveSub.next(decodedToken.isInhabitantActive);

    this.setUserId(decodedToken.sub);
    this.setUsername(decodedToken.username);
    this.setRoles(decodedToken.roles);
    this.setAdminId(decodedToken.admin);
    this.setInhabitantId(decodedToken.inhabitant);
    this.setLoggedIn(true);
    this.setIsInhabitantActive(decodedToken.isInhabitantActive);
  }

  logout(): void {
    this.usernameSub.next(null);
    this.loggedInSub.next(false);
    this.userIdSub.next(null);
    this.rolesSub.next(null);
    this.adminIdSub.next(null);
    this.inhabitantIdSub.next(null);
    this.isInhabitantActiveSub.next(false);

    this.username = null;
    this.userId = null;
    this.loggedIn = false;
    this.roles = null;
    this.adminId = null;
    this.inhabitantId = null;
    this.isInhabitantActive = false;

    localStorage.clear();
  }

  isLoggedIn(): boolean {
    let token = localStorage.getItem('id_token'),
      isLoggedIn = false;
    if (token !== null) {
      isLoggedIn = this.loggedIn && !this.jwtHelper.isTokenExpired(token);
    }
    this.loggedInSub.next(isLoggedIn);
    this.setLoggedIn(isLoggedIn);
    return isLoggedIn;
  }

  setLoggedIn(loggedIn): void {
    this.loggedIn = loggedIn;
    localStorage.setItem("logged_in", loggedIn);
  }

  getRoles(): any {
    return this.roles;
  }

  setRoles(roles) {
    this.roles = roles;
    localStorage.setItem("roles", roles.join(','));
  }

  getUserId() {
    return this.userId;
  }

  setUserId(userId) {
    this.userId = userId;
    localStorage.setItem("userId", userId);
  }

  getAdminId() {
    return this.adminId;
  }

  setAdminId(adminId) {
    this.adminId = adminId;
    localStorage.setItem("adminId", adminId);
  }

  getInhabitantId() {
    return this.inhabitantId;
  }

  setInhabitantId(inhabitantId) {
    this.inhabitantId = inhabitantId;
    localStorage.setItem("inhabitantId", inhabitantId);
  }

  getUsername() {
    return this.username;
  }

  setUsername(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }

  getIsInhabitantActive(): boolean {
    return this.isInhabitantActive;
  }

  setIsInhabitantActive(isActive: boolean) {
    this.isInhabitantActive = isActive;
    localStorage.setItem("isInhabitantActive", isActive.toString());
  }

  serverValidation(value: string, type: string, valueAdd: string = ''): Observable<Response> {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.get(this.config.getConfig('api') + `/validation?type=` + type + `&value=` + value + `&valueAdd=` + valueAdd, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  registrate(userData: UserData): Observable<Response> {
    userData.roles = ['user'];
    return this.http.post(this.config.getConfig('api') + `/registration`, userData, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getProfile(): Observable<Response> {
    let userId = this.getUserId();
    return this.authHttp.get(this.config.getConfig('api') + `/users/${userId}`, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateProfile(userData: UserData): Observable<Response> {
    return this.authHttp.put(this.config.getConfig('api') + `/users/${userData["id"]}`, userData, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
