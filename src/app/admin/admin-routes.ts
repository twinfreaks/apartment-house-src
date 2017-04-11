import {Routes} from "@angular/router";
import {AdminDashboardComponent} from "app/admin/admin-dashboard/admin-dashboard.component";
import {CalendarEventsComponent} from "app/admin/admin-events/calendar-events/calendar-events.component";
import {BlogListComponent} from "app/shared/blogs/blog-list/blog-list.component";
import {BlogAddEditComponent} from "app/admin/admin-blogs/blog-add-edit/blog-add-edit.component";
import {AdminCalculationsRootComponent} from "app/admin/admin-calculations/admin-calculations-root/admin-calculations-root.component";
import {RequestsComponent} from "app/admin/admin-requests/requests/requests.component";
import {ProtocolsComponent} from "../shared/protocols/protocols.component";
import {BlogWrapperComponent} from "../shared/blogs/blog-wrapper/blog-wrapper.component";
import {InhabitantsTabsComponent} from "app/admin/admin-inhabitants/inhabitants-tabs/inhabitants-tabs.component";
import {AuthGuardService} from "app/auth/services/auth-guard.service";
import {ManageRequestTypesComponent} from "app/admin/admin-requests/manage-request-types/manage-request-types.component";
import {AddEditTypeComponent} from "app/admin/admin-requests/add-edit-type/add-edit-type.component";
import {AdministratorsListComponent} from "./admin-administrators/administrators-list/administrators-list.component";
import {AdministratorEditComponent} from "./admin-administrators/administrator-edit/administrator-edit.component";

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'events',
    component: CalendarEventsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'blogs',
    component: BlogListComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'blog-add',
    component: BlogAddEditComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'blog-edit/:id',
    component: BlogAddEditComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'calculations',
    component: AdminCalculationsRootComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'blogs/:blogId',
    component: BlogWrapperComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'protocols',
    component: ProtocolsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'inhabitants',
    component: InhabitantsTabsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'administrators',
    component: AdministratorsListComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin']}
  },
  {
    path: 'administrators/add',
    component: AdministratorEditComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin']}
  },
  {
    path: 'administrators/edit/:id',
    component: AdministratorEditComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin']}
  },
  {
    path: 'request-types',
    component: ManageRequestTypesComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'add-request-type',
    component: AddEditTypeComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  },
  {
    path: 'edit-request-type/:id',
    component: AddEditTypeComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['superAdmin', 'adminBlog', 'adminAccountant']}
  }
];
