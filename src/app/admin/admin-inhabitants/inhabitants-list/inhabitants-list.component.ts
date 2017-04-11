import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import {Inhabitant} from "app/admin/admin-inhabitants/models/inhabitant.model";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";
import {AppConfig} from "app/app.config";
import {ConfirmationService} from "primeng/components/common/api";
import {LanguageTranslateService} from "app/shared/language-translate.service";
import {SearchInhabitants} from "app/admin/admin-inhabitants/models/search-inhabitants.model";

@Component({
  selector: 'app-inhabitants-list',
  templateUrl: './inhabitants-list.component.html',
  styleUrls: ['./inhabitants-list.component.scss']
})
export class InhabitantsListComponent implements OnInit, OnChanges {
  @Input() inhabitants: Inhabitant[];
  @Input() type: string;
  @Output() activateInhabitant: EventEmitter<Inhabitant> = new EventEmitter<Inhabitant>();
  @Output() inActivateInhabitant: EventEmitter<Inhabitant> = new EventEmitter<Inhabitant>();
  @Output() deleteInhabitant: EventEmitter<Inhabitant> = new EventEmitter<Inhabitant>();
  @Output() searchInhabitants: EventEmitter<SearchInhabitants> = new EventEmitter<SearchInhabitants>();

  dateFormat: string;
  lang: string;
  itemsPerPage: number = 10;
  sortField: string;
  sortDirection: boolean;
  inhabitantList: Inhabitant[] = [];
  typeList: string;
  title: string;
  noItems: string;
  page: number;

  constructor(private toastr: ToastrService,
              private translate: TranslateService,
              private config: AppConfig,
              private languageService: LanguageTranslateService) {
  }

  ngOnInit() {
    this.lang = this.languageService.getCurrentLanguage();
    this.dateFormat = this.config.getConfig("dateFormat").fullDate;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inhabitants']){
      this.inhabitantList = this.inhabitants;
    }
    if (changes['type']){
      this.typeList = this.type;
      if (this.typeList === 'inactive') {
        this.translate.get("NEW_INHABITANTS").subscribe(
          (data)=> {
            this.title = data;
          }
        );
        this.translate.get("NO_INACTIVE_INHABITANTS_LIST").subscribe(
          (data) => {
            this.noItems = data;
          }
        );
      }
      else {
        this.translate.get("ALL_INHABITANTS").subscribe(
          (data)=> {
            this.title = data;
          }
        );
        this.translate.get("NO_INHABITANTS_LIST").subscribe(
          (data) => {
            this.noItems = data;
          }
        );
      }
    }
  }

  sortBy(field: string, direction: boolean) {
    this.sortDirection = direction;
    this.sortField = field;
    let directionStr: string;
    directionStr = direction === true ? "asc" : "desc";
    this.inhabitantList = _.orderBy(this.inhabitantList, [field], [directionStr]);
  }

  inActivateInhabitantHandler(inhabitant: Inhabitant) {
    this.inActivateInhabitant.next(inhabitant);
  }

  activateInhabitantHandler(inhabitant: Inhabitant) {
    this.activateInhabitant.next(inhabitant);
  }

  deleteInhabitantHandler(inhabitant: Inhabitant) {
    this.deleteInhabitant.next(inhabitant);
  }

  searchInhabitantsHandler(searchInhabitants: SearchInhabitants) {
    this.searchInhabitants.next(searchInhabitants);
  }
}
