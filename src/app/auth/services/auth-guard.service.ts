import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import * as _ from "lodash";
import {AuthAppService} from "app/auth/services/auth-app.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthAppService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    let routeRoles = route.data["roles"] as Array<string>;
    let userRoles = this.authService.getRoles();
    if (_.intersection(routeRoles, userRoles).length != 0 && this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['unauthorized']);
    return false;
  };
}
