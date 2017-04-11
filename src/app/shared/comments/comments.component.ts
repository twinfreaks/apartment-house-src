import {Component, OnInit, DoCheck, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {CommentsHttpService} from "../services/comments-http.service";
import {AddCommentComponent} from "./add-comment/add-comment.component";
import * as _ from "lodash";
import {CommentsModel} from "../models/comments.model";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "../../app.config";
import {AuthAppService} from "../../auth/services/auth-app.service";
import {trigger, state, style, transition, animate} from "@angular/animations";

@Component({
  selector:    'app-comments',
  templateUrl: 'comments.component.html',
  styleUrls:   ['comments.component.scss'],
  animations:  [
    trigger('signal', [
      state('void', style({
        'transform': 'translateY(-30%)',
        'opacity':   '0',
      })),
      transition('* => *', animate(500))
    ]),
    trigger('signal2', [
      state('void', style({
        'opacity':   '0',
      })),
      transition('* => *', animate(500))
    ])
  ]
})
export class CommentsComponent implements OnInit, DoCheck {
  
  @ViewChild(AddCommentComponent)
  private addComment: AddCommentComponent;
  private showAddComment: boolean = false;
  private comments;
  public comment: CommentsModel;
  public inhabitants = {};
  private deleteId = [];
  private blogId = this.commentsHttpService.blogComments;
  public showAnswerButtonParent = true;
  public inhabitantInfo: any;
  throttle = this.config.getConfig('commentsAndBlog').throttleInfiniteScroll;
  scrollDistance = this.config.getConfig('commentsAndBlog').scrollDistanceInfiniteScroll;
  commentsToShowScroll = this.config.getConfig('commentsAndBlog').commentsToShowScrollStep;
  error: any;
  signal: any;
  
  constructor(private activatedRoute: ActivatedRoute,
              private commentsHttpService: CommentsHttpService,
              private toastr: ToastrService,
              private translateService: TranslateService,
              private config: AppConfig,
              private authAppService: AuthAppService) {
    activatedRoute.params.subscribe(
        (param: any) => commentsHttpService.blogComments = Number(param['blogId'])
    );
  }
  
  ngOnInit() {
    this.getInhabitantInfo();
    this.getComments();
  }
  
  // check if current blog was changed to another blog
  ngDoCheck() {
    if (this.blogId !== this.commentsHttpService.blogComments) {
      this.getComments();
      this.hideAddComments();
      this.blogId = this.commentsHttpService.blogComments;
    }
  }
  
  onScrollDown() {
    this.commentsHttpService.commentsToShow += this.commentsToShowScroll;
  }
  
  getComments() {
    this.commentsHttpService.getComments()
        .subscribe(
            (data) => {
              this.comments = data['data'];
              if (this.comments.length !== 0) {
                this.populateInhabitant();
              }
            },
            (error) => {
              this.error = error;
              console.log(error);
            })
  }
  
  populateInhabitant() {
    // create Object "inhabitants" with key of comment-single id and value of inhabitant info
    for (let i = 0; i < this.comments.length; i++) {
      this.inhabitants[this.comments[i]['id']] = this.comments[i]['inhabitant'];
    }
    // iterate over all comments
    _.forEach(this.comments, (parentComment) => {
      // find comments with nested comments
      if (parentComment['comments'].length !== 0) {
        let i = 0;
        // iterate over nested comments in each parent comment-single and set inhabitant info of   nested comments to  inhabitant from object "inhabitants"
        _.forEach(parentComment['comments'], (childComment) => {
          childComment.inhabitant = this.inhabitants[childComment.id];
          this.deleteId.push(childComment.id);
          i++;
        })
      }
    });
    // delete duplicated records
    for (let i = 0; i < this.deleteId.length; i++) {
      let j = 0;
      while (this.comments[j].id !== this.deleteId[i] && j < this.comments.length) {
        j++;
      }
      this.comments.splice(j, 1);
    }
    // reset deleteId array
    this.deleteId = [];
  }
  
  // take from child when new comment-single or new answer for comment-single was added
  newAnswer(event) {
    this.getComments();
    this.showAnswerButtonParent = true;
    if (event === 'error') {
      this.toastr.error(this.translateService.instant('COMMENT_SERVER_ERROR'));
    } else {
      this.toastr.success(this.translateService.instant(event));
    }
  }
  
  // for checking that if user is not a superadmin
  getInhabitantInfo() {
    this.commentsHttpService.getInhabitantInfo(this.authAppService.getUserId())
        .subscribe(
            (data) => {
              this.inhabitantInfo = data['data'][0]['inhabitants'][0];
            },
            (error) => {
              this.error = error;
              console.log(error);
            })
  }
  
  // take from child when to hide add new comment-single button
  hideAnswerButtonParentEmit() {
    this.showAnswerButtonParent = false;
  }
  
  // take from child when to show add new comment-single button
  showAnswerButtonParentEmit() {
    this.showAnswerButtonParent = true;
  }
  
  // if we have to show add comment-single component
  showAddComments() {
    this.showAddComment = true;
    this.showAnswerButtonParent = false;
  }
  
  // if we have to hide add comment-single component
  hideAddComments() {
    this.showAddComment = false;
    this.showAnswerButtonParent = true;
  }
  
  // reset to null comment-single ID in http service
  resetCommentId() {
    this.commentsHttpService.parentCommentId = null;
  }
}