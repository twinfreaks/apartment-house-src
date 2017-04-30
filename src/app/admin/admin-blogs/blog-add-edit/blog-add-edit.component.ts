import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as _ from 'lodash';
import {SelectItem, ConfirmationService} from 'primeng/primeng';
import * as moment from 'moment';
import {ModalDirective} from 'ngx-bootstrap';

import {BlogHttpService} from 'app/shared/services/blog-http.service';
import {EventsHttpService} from 'app/shared/services/events-http.service';
import {GalleryHttpService} from 'app/shared/services/gallery-http.service';
import {AuthAppService} from "app/auth/services/auth-app.service";
import {Blog} from 'app/shared/models/blog';
import {CalendarEvent} from "app/shared/models/calendar-event";
import {AppConfig} from "app/app.config";
import {datePickerLangUk} from "i18n/datepicker-primeng";
import {datePickerLangEn} from "i18n/datepicker-primeng";
import {ImageOfGallery} from "app/shared/models/image-of-gallery";

@Component({
  selector: 'app-blog-add-edit',
  templateUrl: './blog-add-edit.component.html',
  styleUrls: ['./blog-add-edit.component.scss'],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class BlogAddEditComponent implements OnInit {
  @ViewChild('addEventModal') public addEventModal: ModalDirective;
  blogForm: FormGroup;
  blog: Blog;
  id: number = null;
  blogIdForGallery: number = null;
  isEvent: boolean = false;
  events: SelectItem[] = [];
  dateFormat = this.config.getConfig('dateFormat');
  pristineValue: Blog;
  datePickerLang: any;
  editorConfig = this.config.getConfig('editorConfig');
  title: string;
  addedImages: ImageOfGallery[] = [];
  toDeleteImages: number[] = [];
  blogToSave: Blog = new Blog();
  logoUrl: string = null;
  pristineLogoUrl: string = null;
  sendingToServer:boolean = false;
  recomDescrLength = this.config.getConfig('truncateLengthShotBlog');

  constructor(public translateService: TranslateService,
              private blogHttpService: BlogHttpService,
              private authAppService: AuthAppService,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              private eventsHttpService: EventsHttpService,
              private confirmationService: ConfirmationService,
              private config: AppConfig,
              private galleryHttpService: GalleryHttpService) {
    this.blogForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'text': ['', Validators.required],
      'description': ['', Validators.required],
      'publicatedFrom': ['', Validators.required],
      'event': [null, Validators.required],
      'isActive': [true, Validators.required]
    });
    this.events.push({
      label: "",
      value: null
    })
  }

  setTitle() {
    let titleToTrans: string = (this.id) ? 'EDITING_BLOG' : 'ADDING_BLOG';
    this.translateService.get(titleToTrans).subscribe((res: string) => {
      this.title = res;
    });
  };

  displaySuccessAddUpdBlogRedirect() {
    let message = (this.id) ? "BLOG_IS_UPDATED" : "BLOG_IS_ADDED";
    this.toastrService.success(this.translateService.instant(message));
    this.router.navigate(['/admin/blogs']);
  }

  ngOnInit() {
    this.editorConfig.language = this.translateService.currentLang;
    this.datePickerLang = this.translateService.currentLang === "en" ? datePickerLangEn : datePickerLangUk;
    this.addAddEventButton();
    this.getEvents();
    this.activatedRoute.params
      .subscribe(params => {
        this.id = params["id"];
        this.setTitle();
        if (this.id) {
          this.getBlogAndInitForm();
          return;
        }
        this.clearValidatorAndDisableForEvent();
        this.pristineValue = this.blogForm.value;
      })
  }

  getBlogAndInitForm() {
    this.blogHttpService.getBlogById(this.id)
      .subscribe(data => {
          this.blog = data['data'];
          if (data['data'].event !== null) {
            this.isEvent = true;
          }
          this.logoUrl = data['data'].photo;
          this.pristineLogoUrl = data['data'].photo;
          const blogObj = {
            title: data['data'].title,
            description: data['data'].description,
            text: data['data'].text,
            publicatedFrom: new Date(data['data'].publicatedFrom),
            event: data['data'].event || null,
            isActive: data['data'].isActive
          };
          (<FormGroup>this.blogForm).setValue(blogObj, {onlySelf: true});
          if (!blogObj.event) {
            this.clearValidatorAndDisableForEvent();
          }
          this.pristineValue = this.blogForm.value;
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        })
  };

  saveBlog() {
    this.blogToSave = this.blogForm.value;
    if (this.id) {
      this.blogToSave.id = this.id;
    }
    this.blogToSave.photo = this.logoUrl;
    this.blogToSave.admin = this.authAppService.getAdminId();
    (this.id) ? this.updateBlog(this.blogToSave) : this.addBlog(this.blogToSave);
    this.sendingToServer = true;
  };

  addBlog(blog: Blog) {
    this.blogHttpService.postBlog(blog)
      .subscribe(
        (data) => {
          this.blogIdForGallery = data['data'].id;
        },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_ADD_ERROR'));
        },
        () => {
          this.addDeleteFromGallery();
        }
      );
  };

  updateBlog(blog: Blog) {
    this.blogHttpService.putBlog(blog)
      .subscribe(
        (data) => {
          this.blogIdForGallery = data['data'].id;
        },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_UPDATE_ERROR'));
        },
        () => {
          this.addDeleteFromGallery();
        }
      );
  };

  clearValidatorAndDisableForEvent() {
    this.blogForm.controls['event'].clearValidators();
    this.blogForm.controls['event'].disable();
    this.blogForm.controls['event'].updateValueAndValidity();
  };

  changeIsEvent() {
    if (this.isEvent) {
      this.blogForm.controls['event'].setValue(null);
      this.blogForm.controls['event'].markAsPristine();
      this.clearValidatorAndDisableForEvent();
    } else {
      this.blogForm.controls['event'].markAsUntouched();
      this.blogForm.controls['event'].enable();
      this.blogForm.controls['event'].setValidators(Validators.required);
      this.blogForm.controls['event'].updateValueAndValidity();
    }
    this.isEvent = !this.isEvent;
  };

  addAddEventButton() {
    this.translateService.get('ADD_NEW_EVENT').subscribe((res: string) => {
      this.events.splice(1, 0, {label: res, value: "add event"});
    });
  };

  addEventIsSelected(selectedValue: any) {
    if (selectedValue === "add event") {
      this.addEventModal.show();
    }
  };

  onAddEvent(newEvent: CalendarEvent) {
    this.addEvent(newEvent);
  };

  onCloseAddEventModal() {
    this.blogForm.controls['event'].setValue(null);
    this.blogForm.controls['event'].updateValueAndValidity();
  };

  getEvents() {
    this.eventsHttpService.getAllEvents()
      .subscribe(
        (data) => {
          data['data'] = _.orderBy(data['data'], ['updatedAt', 'id'], ['desc', 'desc']);
          data['data'].forEach((event) => {
            this.events.push({
              label: moment(event.start).format(this.dateFormat.dateTraditional) + " - " + event.title,
              value: event.id
            })
          })
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        }
      );
  };

  addEvent(event: CalendarEvent) {
    this.eventsHttpService.postEvent(event)
      .subscribe(
        (data) => {
          this.events.splice(2, 0,
            {
              label: moment(data['data'].start).format(this.dateFormat.dateTraditional) + " - " + data['data'].title,
              value: data['data'].id
            }
          );
          this.blogForm.controls['event'].setValue(data['data'].id);
          this.blogForm.controls['event'].updateValueAndValidity();
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_ADD_ERROR'));
          this.addEventModal.hide();
          this.blogForm.controls['event'].setValue(null);
          this.blogForm.controls['event'].updateValueAndValidity();
        },
        () => {
          this.toastrService.success(this.translateService.instant('EVENT_IS_ADDED'));
          this.addEventModal.hide();
        }
      );
  };

  checkChangeData() {
    if (_.isEqual(this.pristineValue, this.blogForm.value) &&
      _.isEqual(this.toDeleteImages, []) &&
      _.isEqual(this.addedImages, []) &&
      this.logoUrl === this.pristineLogoUrl) {
      return false;
    }
    return true;
  }

  disableSaveButton() {
    if (!this.blogForm.valid ||
        !this.checkChangeData() ||
        this.sendingToServer) {
      return true;
    }
    return false;
  }

  returnToBlogList() {
    if (this.checkChangeData()) {
      this.confirmationService.confirm({
        message: this.translateService.instant("ACCEPTING_RETURN_TO BLOG_LIST"),
        accept: () => {
          this.router.navigate(['/admin/blogs']);
        }
      });
      return;
    }
    this.router.navigate(['/admin/blogs']);
  };

  logoUrlEmitted(logoUrl) {
    this.logoUrl = logoUrl;
  }

  imagesForAddingEmitted(images:ImageOfGallery[]) {
    this.addedImages = images;
  }

  imagesForDeletingEmitted(imagesId: number[]) {
    this.toDeleteImages = imagesId;
  };

  uploadToGallery() {
    if (!this.id) {
      _.forEach(this.addedImages, (image) => {
        image.blog = this.blogIdForGallery;
      });
    }
    this.uploadUrlToGallery(this.addedImages);
  };

  addDeleteFromGallery() {
    if (this.addedImages.length !== 0) {
      this.uploadToGallery();
      return;
    }
    if (this.toDeleteImages.length !== 0) {
      this.deleteFromGallery(this.toDeleteImages);
      return;
    }
    this.displaySuccessAddUpdBlogRedirect();
  }

  uploadUrlToGallery(images: ImageOfGallery[]) {
    this.galleryHttpService.postImages(images)
      .subscribe(
        (data) => { },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_ADD_ERROR'));
        },
        () => {
          this.addedImages = [];
          this.addDeleteFromGallery();
        }
      );
  };

  deleteFromGallery(imagesId:number[]) {
    this.galleryHttpService.deleteImages(imagesId)
      .subscribe(
        (data) => { },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_DELETE_ERROR'));
        },
        () => {
          this.toDeleteImages = [];
          this.addDeleteFromGallery();
        }
      )
  };
}
