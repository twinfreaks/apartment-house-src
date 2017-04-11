import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {UserRootComponent} from "app/user/user-root/user-root.component";
import {AdminRootComponent} from "app/admin/admin-root/admin-root.component";
import {PageNotFoundComponent} from "app/core/page-not-found/page-not-found.component";
import {adminRoutes} from "app/admin/admin-routes";
import {userRoutes} from "app/user/user-routes";
import {authRoutes} from "app/auth/auth-routes";
import {AuthLoginPageComponent} from "app/auth/auth-login-page/auth-login-page.component";
import {oAuthRoutes} from "app/oauth/oauth-routes";
import {UnauthorizedComponent} from "app/core/unauthorized/unauthorized.component";

const appRoutes: Routes = [
  {
    path: "",
    component: AuthLoginPageComponent
  },
  ...authRoutes,
  ...oAuthRoutes,
  {
    path: "user",
    component: UserRootComponent,
    children: [...userRoutes]
  },
  {
    path: "admin",
    component: AdminRootComponent,
    children: [...adminRoutes]
  },
  {
    path: "unauthorized",
    component: UnauthorizedComponent
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule {
}
