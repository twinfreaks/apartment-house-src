import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {RoutingModule} from "app/routing/routing.module";
import {SharedModule} from "app/shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/primeng";
import {DropdownModule} from "primeng/primeng";
import {ConfirmDialogModule} from "primeng/primeng";
import {ModalModule} from "ngx-bootstrap/modal";
import {AdminEventsModule} from "app/admin/admin-events/admin-events.module";
import {CKEditorModule} from "ng2-ckeditor";
import {FileUploadModule} from "primeng/primeng";
import {BlogsModule} from "app/shared/blogs/blogs.module";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {BlogAddEditGalleryComponent} from "./blog-add-edit-gallery/blog-add-edit-gallery.component";
import {BlogAddEditComponent} from "./blog-add-edit/blog-add-edit.component";
import {AddEventFromBlogEditModalComponent} from "./add-event-from-blog-edit/add-event-from-blog-edit-modal.component";
import {LogoUploadComponent} from "./logo-upload/logo-upload.component";
import {GalleryModalComponent} from "./gallery-modal/gallery-modal.component";
import {ViberModule} from "../viber/viber.module";

@NgModule({
  imports: [
    CKEditorModule,
    TranslateModule,
    AdminEventsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RoutingModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    ConfirmDialogModule,
    ModalModule.forRoot(),
    FileUploadModule,
    ViberModule,
    BlogsModule
  ],
  exports: [  ],
  declarations: [
    BlogAddEditComponent,
    AddEventFromBlogEditModalComponent,
    BlogAddEditGalleryComponent,
    LogoUploadComponent,
    GalleryModalComponent
  ],
  providers: [
    AuthAppService
  ]
})
export class AdminBlogsModule { }
