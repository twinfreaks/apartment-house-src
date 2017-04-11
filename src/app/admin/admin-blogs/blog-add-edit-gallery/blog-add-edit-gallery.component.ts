import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";
import {ModalDirective} from "ng2-bootstrap";

import {AppConfig} from "app/app.config";
import {ImageOfGallery} from "app/shared/models/image-of-gallery";
import {GalleryHttpService} from "app/shared/services/gallery-http.service";

@Component({
  selector: 'app-blog-add-edit-gallery',
  templateUrl: './blog-add-edit-gallery.component.html',
  styleUrls: ['./blog-add-edit-gallery.component.scss']
})
export class BlogAddEditGalleryComponent implements OnInit {
  @ViewChild('galleryModal') public galleryModal: ModalDirective;
  @Input() id: number = null;
  @Output() imagesForAdding: EventEmitter<ImageOfGallery[]> = new EventEmitter<ImageOfGallery[]>();
  @Output() imagesForDeleting: EventEmitter<number[]> = new EventEmitter<number[]>();

  addedImages: ImageOfGallery[] = [];
  existingGallery: ImageOfGallery[] = [];
  gallery: ImageOfGallery[] = [];
  imagesToDeleteFromExistingGallery: number[] = [];
  imageToShow: string = null;

  apiUrl = this.config.getConfig('api');
  uploadDestination = this.config.getConfig('uploadDestinationForBlogs');
  uploadUrl = `${this.config.getConfig('api')}/upload`;

  constructor(private config: AppConfig,
              private galleryHttpService: GalleryHttpService,
              private toastrService: ToastrService,
              public translateService: TranslateService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.getExistingGallery(this.id);
    }
  }

  zoomImage(url: string) {
    this.imageToShow = url;
    this.galleryModal.show();
  }

  getExistingGallery(blogId: number) {
    this.galleryHttpService.getGallery(blogId)
      .subscribe(
        (data) => {
          _.forEach(data['data'], (image) => {
            this.existingGallery.push(
              {
                id: image.id,
                blog: image.blog,
                photoUrl: image.photoUrl
              }
            )
          })
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_ADD_ERROR'));
        },
        () => {
          this.gallery = this.gallery.concat(this.existingGallery);
        }
      )
  };

  initCommonGallery() {
    this.gallery = [];
    this.gallery = this.gallery.concat(this.existingGallery);
    this.gallery = this.gallery.concat(this.addedImages);
  };

  onUploadImages(event) {
    let res = JSON.parse(event.response),
      blogId = (this.id) ? Number(this.id) : null;
    _.forEach(res, (item) => {
      this.addedImages.push({
        photoUrl: item.filename,
        blog: blogId
      });
    });
    this.imagesForAdding.emit(this.addedImages);
    this.toastrService.success(this.translateService.instant('PHOTOS_IS_UPLOADED'));
    this.initCommonGallery();
  };

  onErrorUploadImages() {
    this.toastrService.error(this.translateService.instant('UPLOAD_ERROR'));
  };

  addDestination(formData) {
    formData.append('destination', this.uploadDestination);
  };

  onDeleteFromGallery(imageIndex: number) {
    let imageName = this.gallery[imageIndex].photoUrl,
      indexOfAddedImage: number,
      indexOfExistingGallery: number,
      imageIdOfExistingGallery: number;
    this.gallery.splice(imageIndex, 1);
    indexOfAddedImage = _.findIndex(this.addedImages, (image) => {
      return image.photoUrl === imageName;
    });
    if (indexOfAddedImage >= 0) {
      this.addedImages.splice(indexOfAddedImage, 1);
      this.imagesForAdding.emit(this.addedImages);
      return;
    }
    indexOfExistingGallery = _.findIndex(this.existingGallery, (image) => {
      return image.photoUrl === imageName;
    });
    imageIdOfExistingGallery = this.existingGallery[indexOfExistingGallery].id;
    this.imagesToDeleteFromExistingGallery.push(imageIdOfExistingGallery);
    this.existingGallery.splice(indexOfExistingGallery, 1);
    this.imagesForDeleting.emit(this.imagesToDeleteFromExistingGallery);
  };
}
