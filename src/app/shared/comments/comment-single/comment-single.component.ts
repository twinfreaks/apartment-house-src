import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {CommentsHttpService} from "../../services/comments-http.service";
import {AuthAppService} from "app/auth/services/auth-app.service";
import * as _ from "lodash";
import * as moment from "moment/moment";
import {AppConfig} from "../../../app.config";
import {trigger, style, animate, transition, state} from "@angular/animations";

@Component({
  selector:    'app-single-comment',
  templateUrl: 'comment-single.component.html',
  styleUrls:   ['comment-single.component.scss'],
  animations:  [
    trigger('signal', [
      state('void', style({
        'transform': 'translateY(-30%)',
        'opacity':   '0',
      })),
      transition('* => *', animate(500))
    ])
  ]
})
export class CommentSingleComponent implements OnInit {
  
  @Input() comment: any;
  @Input() showAnswerButtonParent;
  @Output() showAnswerButtonParentEmit = new EventEmitter<boolean>();
  @Output() hideAnswerButtonParentEmit = new EventEmitter<boolean>();
  @Output() newAnswer = new EventEmitter<string>();
  @Output() emitId = new EventEmitter<number>();
  showAddComment: boolean = false;
  showEditComment: boolean = false;
  showMore: boolean = false;
  isAdmin: boolean;
  error: any;
  signal: any;
  editedId: number;
  timeDiff = {};
  timeToEdit: string = this.config.getConfig('commentsAndBlog').timeToEditCommentHours;
  photoUrl: string = this.config.getConfig('files') + '/userProfile/';
  defaultAvatar: string = this.config.getConfig('commentsAndBlog').defaultAvatar;
  private inhabitantId: number;
  private adminId: number;
  private showEditChildComment: boolean;
  author: any;
  
  constructor(private commentsHttpService: CommentsHttpService,
              private authAppService: AuthAppService,
              private config: AppConfig) {
  }
  
  ngOnInit() {
    if (this.comment.inhabitant) {
      this.author = 'inhabitant';
    } else {
      this.author = 'admin';
    }
    this.isAdmin = this.commentsHttpService.isAdmin();
    this.timeDifference();
    this.authAppService.inhabitantIdSub.subscribe(
        (id) => {
          this.inhabitantId = id;
          if (!this.inhabitantId) {
            this.authAppService.adminIdSub.subscribe(
                (id) => {
                  this.adminId = id;
                }
            );
          }
        }
    );
    this.commentsHttpService.isAdmin();
    this.commentsHttpService.parentCommentId = null;
  }
  
  // make timeDifference object that consist of comment id's as keys and how much hours has passed since comment has publicated
  timeDifference() {
    this.timeDiff[this.comment.id] = Number(moment.duration(moment(new Date).diff(moment(this.comment.createdAt))).asHours());
    _.forEach(this.comment.comments, (childComment) => {
      this.timeDiff[childComment.id] = Number(moment.duration(moment(new Date).diff(moment(childComment.createdAt))).asHours());
    });
  }
  
  deleteComment(id: number, flag: boolean) {
    this.commentsHttpService.parentCommentId = id;
    this.comment.isDeleted = flag;
    this.comment.id = id;
    this.comment.text = '';
    this.commentsHttpService.updateComments(this.comment).subscribe(
        (data) => {
        },
        (error) => {
          this.error = error;
          console.log(error);
          this.newAnswer.emit("error");
        },
        () => {
          if (flag) {
            this.newAnswerEmit("COMMENT_DELETED");
          } else {
            this.newAnswerEmit("COMMENT_SHOWED");
          }
        });
  }
  
  checkDefaultAvatar(logoUrl: any) {
    if (logoUrl) {
      return this.photoUrl + logoUrl;
    }
    return this.defaultAvatar;
  };
  
  // send parent comment-single ID to http service
  setCommentId() {
    this.commentsHttpService.parentCommentId = this.comment.id;
  }
  
  // if we have to show more than 3 answers to the comment-single
  showMoreComments() {
    this.showMore = true;
  }
  
  // emit to parent do we have to hide add new comment-single button
  hideAnswerButtonEmit() {
    this.hideAnswerButtonParentEmit.emit();
  }
  
  // emit to parent do we have to show add new comment-single button
  showAnswerButtonEmit() {
    this.showAnswerButtonParentEmit.emit();
  }
  
  // if we have to show add comment-single component
  showAddComments() {
    this.showAddComment = true;
  }
  
  // if we have to hide add comment-single component
  hideAddComments() {
    this.showAddComment = false;
  }
  
  // if we have to show edit comment-single component
  showEditComments(id: number, text: string) {
    this.commentsHttpService.commentId = id;
    this.commentsHttpService.commentText = text;
    this.showEditComment = true;
  }
  
  // if we have to hide add comment-single component
  hideEditComments() {
    this.showEditComment = false;
  }
  
  // if we have to show edit child comment-single component
  showEditChildComments(id: number, text: string) {
    this.commentsHttpService.commentId = id;
    this.commentsHttpService.commentText = text;
    this.editedId = id;
    this.showEditChildComment = true;
  }
  
  // if we have to hide add child comment-single component
  hideEditChildComments() {
    this.showEditChildComment = false;
  }
  
  // emit event when we have added new answer to the comment-single
  newAnswerEmit(event) {
    this.newAnswer.emit(event);
  }
}