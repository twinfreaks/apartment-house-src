import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {ConfirmationService} from "primeng/primeng";
import * as _ from "lodash";

import {RequestType} from "app/shared/models/request-type.model";
import {RequestHttpService} from "app/shared/services/request-http.service";

@Component({
  selector: 'app-manage-request-types',
  templateUrl: './manage-request-types.component.html',
  styleUrls: ['./manage-request-types.component.scss'],
  providers: [ConfirmationService]
})
export class ManageRequestTypesComponent implements OnInit {
  types: RequestType[] = [null];
  sendingToServer: boolean = false;

  constructor(private translateService: TranslateService,
              private requestHttpService: RequestHttpService,
              private toastrService: ToastrService,
              private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  getTypes() {
    this.requestHttpService.getTypes()
      .subscribe(
        (data) => {
          this.types = data['data'];
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        },
        () => { }
      );
  }

  deleteType(id: number) {
    this.sendingToServer = true;
    this.requestHttpService.deleteType(id)
      .subscribe(
        (data) => { },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_DELETE_ERROR'));
        },
        () => {
          this.deleteRequests(id);
        }
      );
  }

  deleteRequests(typeId: number) {
    this.requestHttpService.deleteRequestes(typeId)
      .subscribe(
        (data) => { },
        (err: any) => {
          this.sendingToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_DELETE_ERROR'));
        },
        () => {
          let index = _.findIndex(this.types, (type) => {
            return type.id === typeId;
          });
          this.types.splice(index, 1);
          this.toastrService.success(this.translateService.instant('TYPE_IS_DELETED'));
          this.sendingToServer = false;
        }
      );
  }

  confirmTypeDeleting(id: number) {
    this.confirmationService.confirm({
      message: this.translateService.instant("ACCEPTING_DELETE_TYPE"),
      accept: () => {
        this.deleteType(id)
      }
    });
  }
}
