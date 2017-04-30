import {Component, ViewChild, Output, EventEmitter} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {Administrator} from "../administrator.model";
import {AdministratorsService} from "../administrators.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-administrator-delete-modal',
  templateUrl: './administrator-delete-modal.component.html'
})
export class AdministratorDeleteModalComponent {
  @ViewChild('lgModal') modal: ModalDirective;
  @Output() deleteAdministrator: EventEmitter<Administrator> = new EventEmitter<Administrator>();
  administrator: Administrator;

  constructor(private administratorService: AdministratorsService,
              private toastr: ToastrService,
              private translate: TranslateService
  ) { }

  deleteConfirm(administrator: Administrator) {
    this.administrator = administrator;
    this.modal.show();
  }

  doDeleteAdministrator(administrator: Administrator) {
    this.administratorService.remove(administrator.id)
      .subscribe(
        (data) => {
          this.deleteAdministrator.next(administrator);
          this.modal.hide();
        },
        (error) => {
          this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
        })
  }
}