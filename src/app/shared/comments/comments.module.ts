import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CommentSingleComponent} from "./comment-single/comment-single.component";
import {CommentsComponent} from "./comments.component";
import {AddCommentComponent} from "./add-comment/add-comment.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthAppService} from "../../auth/services/auth-app.service";
import {MomentModule} from "angular2-moment";
import {CoreModule} from "../../core/core.module";
import {InfiniteScrollModule} from "angular2-infinite-scroll";
import {EditCommentComponent} from "./edit-comment/edit-comment.component";

@NgModule({
  imports:      [
    CommonModule,
    CoreModule,
    TranslateModule,
    ReactiveFormsModule,
    MomentModule,
    InfiniteScrollModule
  ],
  exports:      [CommentsComponent],
  providers:    [AuthAppService],
  declarations: [CommentSingleComponent, CommentsComponent, AddCommentComponent, EditCommentComponent]
})
export class CommentsModule {
}
