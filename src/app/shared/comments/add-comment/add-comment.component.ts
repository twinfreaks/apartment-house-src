import {Component, OnInit, EventEmitter, Output} from "@angular/core";
import {CommentsHttpService} from "../../services/comments-http.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {AuthAppService} from "../../../auth/services/auth-app.service";
import {CustomValidators} from "ng2-validation";
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "../../../app.config";

@Component({
  selector:    'app-add-comment',
  templateUrl: 'add-comment.component.html',
  styleUrls:   ['add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  
  @Output() newAnswer = new EventEmitter<string>();
  private comments: any;
  inhabitant: any;
  error: any;
  myForm: FormGroup;
  photoUrl: string = this.config.getConfig('api') + '/userProfile/';
  defaultAvatar: string = this.config.getConfig('commentsAndBlog').defaultAvatar;
  
  constructor(private commentsHttpService: CommentsHttpService,
              private authAppService: AuthAppService,
              private formBuilder: FormBuilder,
              public translateService: TranslateService,
              private config: AppConfig) {
    this.myForm = this.formBuilder.group({
      'text':       ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      'inhabitant': [this.authAppService.getInhabitantId(), CustomValidators.number]
    });
  }
  
  onSubmit() {
    this.myForm.value['blog'] = this.commentsHttpService.blogComments;
    this.myForm.value['inhabitant'] = this.authAppService.getInhabitantId();
    this.myForm.value['parentCommentId'] = this.commentsHttpService.parentCommentId;
    this.postComment();
  }
  
  ngOnInit() {
    this.getInhabitantInfo();
  }
  
  getInhabitantInfo() {
    this.commentsHttpService.getInhabitantInfo(this.authAppService.getUserId())
        .subscribe(
            (data) => {
              this.inhabitant = data['data'][0]['inhabitants'][0];
            },
            (error) => {
              this.error = error;
              console.log(error);
            })
  }
  
  postComment() {
    this.commentsHttpService.postComment(this.myForm.value)
        .subscribe(
            (data) => {
              this.comments = data['data'];
              this.commentsHttpService.parentCommentId = null;
            },
            (error) => {
              this.error = error;
              console.log(error);
              this.newAnswer.emit("error");
            },
            () => {
              this.newAnswer.emit("COMMENT_ADDED_SUCCESS");
            })
  }
  
  checkDefaultAvatar(logoUrl: any) {
    if (logoUrl) {
      return this.photoUrl + logoUrl;
    }
    return this.defaultAvatar;
  };
}