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
import {ModalDirective} from "ngx-bootstrap";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ProfanityHttpService} from "../services/profanity-http.service";

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
        'opacity': '0',
      })),
      transition('* => *', animate(500))
    ])
  ]
})
export class CommentsComponent implements OnInit, DoCheck {
  
  @ViewChild('lgModal') modal: ModalDirective;
  @ViewChild(AddCommentComponent)
  private addComment: AddCommentComponent;
  private showAddComment: boolean = false;
  private comments;
  public comment: CommentsModel;
  public inhabitants = {};
  public admins = {};
  private deleteId = [];
  private blogId = this.commentsHttpService.blogComments;
  public showAnswerButtonParent = true;
  public inhabitantInfo: any;
  throttle = this.config.getConfig('commentsAndBlog').throttleInfiniteScroll;
  scrollDistance = this.config.getConfig('commentsAndBlog').scrollDistanceInfiniteScroll;
  commentsToShowScroll = this.config.getConfig('commentsAndBlog').commentsToShowScrollStep;
  error: any;
  signal: any;
  isAdmin: boolean;
  myForm: FormGroup;
  isActiveFileUpload: boolean = true;
  private file: any;
  private file2: any;
  private file3: any;
  sensitivity: number;
  sensChanged: boolean;
  profanityLink = this.config.getConfig('api') + `/edit-profanity/download/1`;
  exceptionsLink = this.config.getConfig('api') + `/edit-profanity/download/2`;
  profanity2Link = this.config.getConfig('api') + `/edit-profanity/download/3`;
  
  constructor(private activatedRoute: ActivatedRoute,
              private commentsHttpService: CommentsHttpService,
              private toastr: ToastrService,
              private translateService: TranslateService,
              private config: AppConfig,
              private authAppService: AuthAppService,
              private formBuilder: FormBuilder,
              private profanityHttpService: ProfanityHttpService) {
    activatedRoute.params.subscribe(
        (param: any) => commentsHttpService.blogComments = Number(param['blogId'])
    );
    this.myForm = this.formBuilder.group({
      'profanity':      ['', Validators.compose([Validators.maxLength(20)])],
      'exceptions':     ['', Validators.compose([Validators.maxLength(20)])],
      'profanity2':     ['', Validators.compose([Validators.maxLength(20)])],
      'profanityFile':  [''],
      'profanityFile2': [''],
      'exceptionsFile': ['']
    });
  }
  
  ngOnInit() {
    this.isAdmin = this.commentsHttpService.isAdmin();
    this.getInhabitantInfo();
    this.getComments();
    this.formChanges();
    this.getProfanitySensitivity();
  }
  
  // check if current blog was changed to another blog
  ngDoCheck() {
    if (this.blogId !== this.commentsHttpService.blogComments) {
      this.getComments();
      this.hideAddComments();
      this.blogId = this.commentsHttpService.blogComments;
    }
  }
  
  changeSensitivity(value) {
    this.sensitivity = value;
    this.sensChanged = true;
  }
  
  getProfanitySensitivity() {
    this.profanityHttpService.getSensitivity()
        .subscribe(
            (data) => {
              this.sensitivity = Number(data.data);
            },
            (error) => {
              this.error = error;
              console.log(error);
            });
  }
  
  setProfanitySensitivity(value) {
    this.profanityHttpService.setSensitivity(value)
        .subscribe(
            (data) => {
              this.sensitivity = Number(data.data);
              this.toastr.success(this.translateService.instant("PROFANITY_SETTINGS_APPLY"));
            },
            (error) => {
              this.error = error;
              this.toastr.error(this.translateService.instant('COMMENT_SERVER_ERROR'));
              console.log(error);
            });
  }
  
  onSubmit() {
    if (this.sensChanged) {
      this.setProfanitySensitivity(this.sensitivity);
    }
    this.getProfanitySensitivity();
    if (this.myForm.value.profanity || this.myForm.value.exceptions || this.myForm.value.profanity2) {
      this.profanityHttpService.addToProfanity(this.myForm.value)
          .subscribe(
              (data) => {
                this.reset();
                this.toastr.success(this.translateService.instant("PROFANITY_SETTINGS_APPLY"));
              },
              (error) => {
                this.error = error;
                this.toastr.error(this.translateService.instant('COMMENT_SERVER_ERROR'));
                console.log(error);
              });
    } else if (this.file && !this.myForm.value.profanity && !this.myForm.value.exceptions) {
      this.profanityHttpService.uploadVocabulary(this.file, '1');
      this.reset();
    } else if (this.file2 && !this.myForm.value.profanity && !this.myForm.value.exceptions) {
      this.profanityHttpService.uploadVocabulary(this.file2, '2');
      this.reset();
    } else if (this.file3 && !this.myForm.value.profanity && !this.myForm.value.exceptions) {
      this.profanityHttpService.uploadVocabulary(this.file3, '3');
      this.reset();
    } else {
      this.reset();
    }
    this.formChanges();
  }
  
  // reset form
  reset() {
    this.getProfanitySensitivity();
    this.myForm = this.formBuilder.group({
      'profanity':      ['', Validators.compose([Validators.maxLength(20)])],
      'exceptions':     ['', Validators.compose([Validators.maxLength(20)])],
      'profanity2':     ['', Validators.compose([Validators.maxLength(20)])],
      'profanityFile':  [''],
      'profanityFile2': [''],
      'exceptionsFile': ['']
    });
    this.file = null;
    this.file2 = null;
    this.file3 = null;
    this.isActiveFileUpload = true;
    this.formChanges();
    this.sensChanged = false;
  }
  
  // to maintain desabling inputs in modal window
  formChanges() {
    this.myForm.valueChanges
        .debounceTime(100)
        .distinctUntilChanged()
        .subscribe(event => {
          let profanity = event.profanity,
              exceptions = event.exceptions,
              profanity2 = event.profanity2;
          if (!(profanity !== '' || exceptions !== '' || profanity2 !== '')) {
            this.isActiveFileUpload = true;
          } else {
            this.isActiveFileUpload = false;
          }
        });
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
      if (this.comments[i]['inhabitant']) {
        this.inhabitants[this.comments[i]['id']] = this.comments[i]['inhabitant'];
      } else {
        this.admins[this.comments[i]['id']] = this.comments[i]['admin'];
      }
    }
    // iterate over all comments
    _.forEach(this.comments, (parentComment) => {
      // find comments with nested comments
      if (parentComment['comments'].length !== 0) {
        let i = 0;
        // iterate over nested comments in each parent comment-single and set inhabitant info of   nested comments to  inhabitant from object "inhabitants"
        _.forEach(parentComment['comments'], (childComment) => {
          if (this.inhabitants[childComment.id]) {
            childComment.inhabitant = this.inhabitants[childComment.id];
          } else {
            childComment.admin = this.admins[childComment.id];
          }
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
    } else if (event === 'profanity') {
      this.toastr.error(this.translateService.instant('PROFANITY'));
    } else {
      this.toastr.success(this.translateService.instant(event));
    }
  }
  
  // for checking that if user is not a superadmin
  getInhabitantInfo() {
    this.commentsHttpService.getInhabitantInfo(this.authAppService.getUserId())
        .subscribe(
            (data) => {
              if (data['data'][0]['inhabitants'].length) {
                this.inhabitantInfo = data['data'][0]['inhabitants'][0];
              } else {
                this.inhabitantInfo = data['data'][0]['admins'][0];
              }
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
  
  // check upload event of file
  fileChange(event) {
    this.file = event;
  }
  
  // check upload event of file2
  fileChange2(event) {
    this.file2 = event;
  }
  
  // check upload event of file3
  fileChange3(event) {
    this.file3 = event;
  }
}