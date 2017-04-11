import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {ModalDirective} from "ng2-bootstrap";

import {AppConfig} from "app/app.config";

@Component({
  selector: 'app-logo-upload',
  templateUrl: './logo-upload.component.html',
  styleUrls: ['./logo-upload.component.scss']
})
export class LogoUploadComponent implements OnInit {
  @ViewChild('galleryModal') public galleryModal: ModalDirective;
  @Input() logoUrl: string = null;
  @Output() logoUrlEmitted: EventEmitter<string> = new EventEmitter<string>();

  apiUrl = this.config.getConfig('api');
  uploadDestination = this.config.getConfig('uploadDestinationForBlogs');
  uploadUrl = `${this.config.getConfig('api')}/upload`
  imageToShow: string = null;

  constructor(private config: AppConfig,
              private toastrService: ToastrService,
              public translateService: TranslateService) { }

  ngOnInit() {
  }

  zoomImage(url: string) {
    this.imageToShow = url;
    this.galleryModal.show();
  }

  onDeleteLogo() {
    this.logoUrl = null;
    this.logoUrlEmitted.emit(this.logoUrl)
  }

  onUploadImages(event) {
    let res = JSON.parse(event.response);
    this.logoUrl = res[0].filename;
    this.logoUrlEmitted.emit(this.logoUrl);
    this.toastrService.success(this.translateService.instant('LOGO_IS_UPLOADED'));
  };

  onErrorUploadImages() {
    this.toastrService.error(this.translateService.instant('UPLOAD_ERROR'));
  };

  addDestination(formData) {
    formData.append('destination', this.uploadDestination);
  };
}
