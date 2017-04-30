import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {RoutingModule} from "app/routing/routing.module";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {ConfirmDialogModule} from "primeng/primeng";
import {SharedModule} from "../shared.module";
import {UserRequestModule} from "app/user/user-request/user-request.module";
import {BlogListComponent} from "app/shared/blogs/blog-list/blog-list.component";
import {BlogWrapperComponent} from "./blog-wrapper/blog-wrapper.component";
import {BlogSinglePageComponent} from "./blog-wrapper/blog-single-page/blog-single-page.component";
import {CommentsModule} from "app/shared/comments/comments.module";
import {MomentModule} from "angular2-moment";
import {Ng2ImageGalleryModule} from "ng2-image-gallery-fixed";
import {AlertModule} from "ngx-bootstrap/alert";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule,
    InfiniteScrollModule,
    RoutingModule,
    ConfirmDialogModule,
    UserRequestModule,
    CommentsModule,
    MomentModule,
    Ng2ImageGalleryModule,
    AlertModule
  ],
  exports: [
    BlogListComponent,
    BlogWrapperComponent
  ],
  declarations: [
    BlogListComponent,
    BlogWrapperComponent,
    BlogSinglePageComponent
  ],
  providers: [
    AuthAppService
  ]
})
export class BlogsModule { }
