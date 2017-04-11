import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService} from "primeng/primeng";
import * as _ from "lodash";

import {RequestHttpService} from "app/shared/services/request-http.service";
import {RequestType} from "app/shared/models/request-type.model";
import {AppConfig} from "app/app.config";

@Component({
  selector: 'app-add-edit-type',
  templateUrl: './add-edit-type.component.html',
  styleUrls: ['./add-edit-type.component.scss'],
  providers: [ConfirmationService],
})
export class AddEditTypeComponent implements OnInit {
  typeForm: FormGroup;
  typeToSave: RequestType;
  id: number;
  title: string;
  typeRequestDesclength: string = this.config.getConfig('typeRequestDesclength');
  pristineValue: RequestType;
  sendingToServer: boolean = false;

  constructor(private translateService: TranslateService,
              private requestHttpService: RequestHttpService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private config: AppConfig,
              private router: Router,
              private confirmationService: ConfirmationService) {
    this.typeForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ['', [Validators.required, Validators.maxLength(Number(this.typeRequestDesclength))]]
    });
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => {
        this.id = params["id"];
        this.setTitle();
        if (this.id) {
          this.getTypeAndInitForm();
          return;
        }
        this.pristineValue = this.typeForm.value;
      })
  }

  getTypeAndInitForm() {
    this.requestHttpService.getType(this.id)
      .subscribe(data => {
          const typeObj = {
            name: data['data'].name,
            description: data['data'].description
          };
          (<FormGroup>this.typeForm).setValue(typeObj, {onlySelf: true});
          this.pristineValue = this.typeForm.value;
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        })
  };

  setTitle() {
    let titleToTrans: string = (this.id) ? 'EDITING_TYPE_REQUEST' : 'ADDING_TYPE_REQUEST';
    this.translateService.get(titleToTrans).subscribe((res: string) => {
      this.title = res;
    });
  };

  checkChangeData() {
    return !_.isEqual(this.pristineValue, this.typeForm.value)
  }

  disableSaveButton() {
    return !this.typeForm.valid || !this.checkChangeData() || this.sendingToServer
  }

  returnToTypes() {
    if (this.checkChangeData()) {
      this.confirmationService.confirm({
        message: this.translateService.instant("ACCEPTING_RETURN_TO_REQUEST_TYPES"),
        accept: () => {
          this.router.navigate(['/admin/request-types']);
        }
      });
      return;
    }
    this.router.navigate(['/admin/request-types']);
  };

  saveType() {
    this.typeToSave = this.typeForm.value;
    if (this.id) {
      this.typeToSave.id = this.id;
    }
    (this.id) ? this.updateType(this.typeToSave) : this.addType(this.typeToSave);
    this.sendingToServer = true;
  };

  updateType(type: RequestType) {
    this.requestHttpService.updateRequestType(type)
      .subscribe(
        (data) => { },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_UPDATE_ERROR'));
        },
        () => {
          this.sendingToServer = false;
          this.displaySuccessAddUpdTypeRedirect();
        }
      );
  };

  addType(type: RequestType) {
    this.requestHttpService.sendRequesttype(type)
      .subscribe(
        (data) => { },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_ADD_ERROR'));
        },
        () => {
          this.sendingToServer = false;
          this.displaySuccessAddUpdTypeRedirect();
        }
      );
  };

  displaySuccessAddUpdTypeRedirect() {
    let message = (this.id) ? "TYPE_IS_UPDATED" : "TYPE_IS_ADDED";
    this.toastrService.success(this.translateService.instant(message));
    this.router.navigate(['/admin/request-types']);
  };
}