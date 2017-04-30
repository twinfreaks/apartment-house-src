import {AppConfig} from 'app/app.config';
import {AuthAppService} from 'app/auth/services/auth-app.service';
import {RouterModule, Routes, ActivatedRoute, Router} from '@angular/router'
import {Component, OnInit, ViewChild, Type} from '@angular/core';
import {CustomValidators} from 'ng2-validation';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import {ModalDirective} from "ngx-bootstrap";
import {Inhabitant} from '../../../shared/inhabitant.model';
import {Observable} from 'rxjs/Observable';
import {ProfileService} from '../../../shared/services/profile.service';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from "app/core/validation-messages/validation.service";
import * as _ from 'lodash';
import {unescape} from "querystring";
import {AuthHttp} from "angular2-jwt";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})

export class ProfileEditComponent implements OnInit {
  private headers = new Headers({'Content-Type': 'application/image;charset=utf-8'});
  private photosUrl = this.config.getConfig('files') + '/userProfile/';
  private uploadUrl = this.config.getConfig('api') + `/upload`;
  appartment: any;
  public showCropper = false;
  public inhabitantId: number = null;
  public myForm: FormGroup;
  public submitted: boolean;
  public formData = new FormData();
  public data2: any;
  public cropperSettings2: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  @ViewChild('lgModal') modal: ModalDirective;

  constructor(private http: AuthHttp,
              private router: Router,
              private config: AppConfig,
              private builder: FormBuilder,
              private authService: AuthAppService,
              private toastrService: ToastrService,
              private profileService: ProfileService,
              private authAppService: AuthAppService,
              private translateService: TranslateService) {
    this.myForm = this.builder.group({
      id: [''],
      surname: ['', Validators.required],
      name: ['', Validators.required],
      patronymic: ['', Validators.required],
      photo: [''],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)])],
      user: [''],
      email: ['', Validators.required],
      building: ['']
    });
    this.cropperSettings2 = new CropperSettings();
    this.cropperSettings2.width = 200;
    this.cropperSettings2.height = 200;
    this.cropperSettings2.croppedWidth = 200;
    this.cropperSettings2.croppedHeight = 200;
    this.cropperSettings2.canvasWidth = 468;
    this.cropperSettings2.canvasHeight = 300;
    this.cropperSettings2.minWidth = 100;
    this.cropperSettings2.minHeight = 100;
    this.cropperSettings2.minWithRelativeToResolution = true;
    this.cropperSettings2.rounded = false;
    this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings2.noFileInput = true;
    this.data2 = {};
  }

  ngOnInit() {
    this.getInhabitantId();
    this.getProfileById();
  }

  getProfileById() {
    this.profileService.getProfileById(this.inhabitantId)
      .subscribe(
        (data) => {
          this.appartment = data.appartment;
          const inhabitant = {
            id: this.inhabitantId,
            surname: data.surname,
            name: data.name,
            patronymic: data.patronymic,
            photo: data.photo,
            phoneNumber: data.phoneNumber,
            user: data.user,
            email: data.email,
            building: data.building,
          };
        (<FormGroup>this.myForm).setValue(inhabitant, {onlySelf: true});
        this.myForm.controls['phoneNumber'].setValidators(Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)]));
        this.myForm.controls['phoneNumber'].setAsyncValidators(ValidationService.phoneExist(this.authService, this.inhabitantId));
        this.myForm.controls['email'].setValidators(Validators.compose([Validators.required, CustomValidators.email]));
        this.myForm.controls['email'].setAsyncValidators(ValidationService.emailExist(this.authService));
        this.myForm.updateValueAndValidity();
        if (!inhabitant) {
          this.myForm.controls['data'].clearValidators();
        }
      }
    )
  }

  putProfile() {
    this.profileService.putProfile(this.myForm.value)
      .subscribe(
        (data) => {
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        },
        () => {
          this.toastrService.success(this.translateService.instant('PROFILE_IS_UPDATED'));
          this.router.navigate(['/']);
        });
  }

  onSubmit() {
    this.submitted = true;
    if (typeof this.data2.image === "undefined"){
      this.putProfile(); 
    } else {
      this.save();
      this.putProfile();
    };
  }

  getInhabitantId() {
    this.authAppService.inhabitantIdSub.subscribe(
      (data) => {
        this.inhabitantId = data;
      }
    )
  }

  save() {
    let formData = new FormData();
    formData.append('file', this.dataURItoBlob(this.data2.image), "imageCropped.jpg");
    formData.append('destination', "userProfile");
    let xhr: XMLHttpRequest = this.uploadRequest(formData);
    this.http.post(`${this.uploadUrl}`, formData)
      .map(res => res.json())
      .catch(error => Observable.throw(error))
      .subscribe(
        data => {
          this.changePhoto(data[0].filename);
        },
        error => console.log(error)
      );
  }

  public uploadRequest(formData) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open('POST', this.config.getConfig("api")+"/upload", true);
    xhr.setRequestHeader("enctype", "multipart/form-data");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Cache-Control", "no-store");
    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.send(formData);
    return xhr;
  }

  public dataURItoBlob(dataURI) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0],
      ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString});
  }

  changePhoto(name: any) {
    this.profileService.changePhoto(this.inhabitantId, name)
      .subscribe(
        (data) => this.getProfileById()
      )
  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }

  fileChangeListener($event) {
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }
}