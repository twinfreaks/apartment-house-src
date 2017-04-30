import {Component, EventEmitter, Output} from "@angular/core";
import {CommentsHttpService} from "../../services/comments-http.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {CommentsModel} from "../../models/comments.model";
import * as moment from "moment/moment";

@Component({
  selector:    'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls:   ['./edit-comment.component.scss']
})
export class EditCommentComponent {
  
  @Output() newAnswer = new EventEmitter<string>();
  private updatedComment = new CommentsModel;
  error: any;
  myForm: FormGroup;
  dateToday: any = new Date();
  
  constructor(private commentsHttpService: CommentsHttpService,
              private formBuilder: FormBuilder,
              public translateService: TranslateService) {
    this.myForm = this.formBuilder.group({
      'text': ['', Validators.compose([Validators.required, Validators.maxLength(200)])]
    });
  }
  
  onSubmit() {
    this.updatedComment.text = this.commentsHttpService.commentText + '<p></br><small>' + this.translateService.instant('COMMENT_UPDATED_TEXT') + moment(this.dateToday).format('LLL') + '</small></br><i> ' + this.myForm.value['text'] + ' </i></p>';
    this.updatedComment.editedAt = this.dateToday;
    this.updatedComment.id = this.commentsHttpService.commentId;
    this.changeComment();
  }
  
  changeComment() {
    this.commentsHttpService.updateComments(this.updatedComment).subscribe(
        (data) => {
          if (data['code'] === 201) {
            this.newAnswer.emit("profanity");
            return;
          } else if (data['code'] === 200) {
            this.newAnswer.emit("COMMENT_EDITED_SUCCESS");
          }
        },
        (error) => {
          this.error = error;
          console.log(error);
          this.newAnswer.emit("error");
        });
  }
}