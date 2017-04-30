import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AdminRootComponent} from "./admin-root/admin-root.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminEventsModule} from "app/admin/admin-events/admin-events.module";
import {AdminBlogsModule} from "app/admin/admin-blogs/admin-blogs.module";
import {AdminCalculationsModule} from "app/admin/admin-calculations/admin-calculations.module";
import {RoutingModule} from "app/routing/routing.module";
import {SharedModule} from "app/shared/shared.module";
import {AdminRequestsModule} from "app/admin/admin-requests/admin-requests.module";
import {AdminInhabitantsModule} from "app/admin/admin-inhabitants/admin-inhabitants.module";
import {AdminAdministratorsModule} from "./admin-administrators/admin-administrators.module";
import {AdminStatisticsModule} from "app/admin/admin-statistics/admin-statistics.module";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    SharedModule,
    AdminEventsModule,
    AdminBlogsModule,
    AdminCalculationsModule,
    AdminRequestsModule,
    AdminInhabitantsModule,
    AdminAdministratorsModule,
    AdminStatisticsModule
  ],
  declarations: [
    AdminRootComponent,
    AdminDashboardComponent
  ],
  exports: [
    AdminBlogsModule
  ]
})
export class AdminModule {
}
