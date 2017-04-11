import { Component, OnInit } from '@angular/core';
import {Administrator} from "../administrator.model";
import {AdministratorsService} from "../administrators.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";

@Component({
  selector: 'app-administrators-list',
  templateUrl: './administrators-list.component.html',
  styleUrls: ['./administrators-list.component.scss']
})
export class AdministratorsListComponent implements OnInit {
  administrators: Administrator[] = [];
  sortField: string;
  sortDirection: boolean;
  itemsPerPage: number = 10;
  page: number;

  constructor(private administratorService: AdministratorsService,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.administratorService.getAll()
      .subscribe(
        (administrators) => {
          this.administrators = administrators;
        },
        (error) => {
          this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
        }
      )
  }

  sortBy(field: string, direction: boolean) {
    this.sortDirection = direction;
    this.sortField = field;
    let directionStr: string;
    directionStr = direction === true ? "asc" : "desc";
    this.administrators = _.orderBy(this.administrators, [field], [directionStr]);
  }

  deleteAdministratorHandler(administrator: Administrator) {
    let indexAdministrator = this.administrators.indexOf(administrator);
    this.administrators.splice(indexAdministrator, 1);
  }
}