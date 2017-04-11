import {Router} from "@angular/router"
import {Component, OnInit} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CustomValidators} from "ng2-validation";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../shared/services/profile.service";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {AppConfig} from "app/app.config";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})

export class ProfileEditComponent implements OnInit {
  private headers = new Headers({'Content-Type': 'application/image;charset=utf-8'});
  private photosUrl = this.config.getConfig('api') + '/userProfile/';
  private uploadUrl = this.config.getConfig('api') + `/upload`;
  public inhabitantId: number = null;
  public myForm: FormGroup;
  public submitted: boolean;
  formData = new FormData();

  constructor(private http: Http,
              private builder: FormBuilder,
              private profileService: ProfileService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private router: Router,
              private authAppService: AuthAppService,
              private config: AppConfig) {
    this.myForm = this.builder.group({
      id: [''],
      surname: ['', Validators.required],
      name: ['', Validators.required],
      patronymic: ['', Validators.required],
      photo: [''],
      phoneNumber: ['', Validators.compose([Validators.required])],
      appartment: ['', CustomValidators.number],
      user: [''],
      building: ['', CustomValidators.number]
    });
  }

  ngOnInit() {
    this.getInhabitantId();
    this.getProfileById();
  }

  getProfileById() {
    this.profileService.getProfileById(this.inhabitantId)
        .subscribe(
            (data) => {
              const inhabitant = {
                id: this.inhabitantId,
                surname: data.surname,
                name: data.name,
                patronymic: data.patronymic,
                photo: data.photo,
                phoneNumber: data.phoneNumber,
                appartment: data.appartment,
                user: null,
                building: data.building,
              };
              (<FormGroup>this.myForm).setValue(inhabitant, {onlySelf: true});
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
              this.router.navigate(['/user']);
            });
  }


  onSubmit(myForm, isValid) {
    this.submitted = true;
    this.putProfile();
  }

  getInhabitantId() {
    this.authAppService.inhabitantIdSub.subscribe(
        (data) => {
          this.inhabitantId = data;
        }
    )
  }

  photoUpload(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0],
          formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('destination', 'userProfile');
      let headers = new Headers(),
          options = new RequestOptions({headers: headers});
      this.http.post(`${this.uploadUrl}`, formData, options)
          .map(res => res.json())
          .catch(error => Observable.throw(error))
          .subscribe(
              data => {
                this.changePhoto(data[0].filename);
              },
              error => console.log(error)
          )
    }
  }

  changePhoto(name: any) {
    this.profileService.changePhoto(this.inhabitantId, name).subscribe(
        (data) => this.getProfileById()
    )
  }
}