import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CalculationsModule} from "app/user/calculations/calculations.module";
import {EventsModule} from "app/user/events/events.module";
import {UserRootComponent} from "./user-root/user-root.component";
import {RoutingModule} from "app/routing/routing.module";
import {SharedModule} from "app/shared/shared.module";
import {BlogsModule} from "app/shared/blogs/blogs.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {ProfileModule} from "app/user/profile/profile.module";
import {ProtocolsModule} from "../shared/protocols/protocols.module";
import {ChatModule} from "app/chat/chat.module";
import { UserInactiveComponent } from "./user-inactive.component";
import {UserSettingsModule} from "./user-settings/user-settings.module";
import {UserLogsService} from "./user-settings/user-logs.service";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    SharedModule,
    CalculationsModule,
    EventsModule,
    DashboardModule,
    ProfileModule,
    ProtocolsModule,
    ChatModule,
    BlogsModule,
    UserSettingsModule
  ],
  declarations: [
    UserRootComponent,
    UserInactiveComponent
  ],
  exports: [
    DashboardModule,
    EventsModule,
    ProtocolsModule
  ],
  providers: [
    UserLogsService
  ]
})
export class UserModule {
}
