import {Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard/dashboard.component";
import {BlogListComponent} from "app/shared/blogs/blog-list/blog-list.component";
import {BlogWrapperComponent} from "../shared/blogs/blog-wrapper/blog-wrapper.component";
import {CalendarEventsComponent} from "app/user/events/calendar-events/calendar-events.component";
import {UserCalculationComponent} from "app/user/calculations/user-calculation/user-calculation.component";
import {ProtocolsComponent} from "../shared/protocols/protocols.component";
import {UserInactiveComponent} from "app/user/user-inactive.component";
import {ProfileEditComponent} from "app/user/profile/profile-edit/profile-edit.component";
import {AuthGuardService} from "app/auth/services/auth-guard.service";
import {UserSettingsPageComponent} from "./user-settings/user-settings-page/user-settings-page.component";

export const userRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'profile',
    component: ProfileEditComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'settings',
    component: UserSettingsPageComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'inactive',
    component: UserInactiveComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'blogs',
    component: BlogListComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'blogs/:blogId',
    component: BlogWrapperComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'events',
    component: CalendarEventsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'protocols',
    component: ProtocolsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  },
  {
    path: 'calculations',
    component: UserCalculationComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['inhabitant']}
  }
];
