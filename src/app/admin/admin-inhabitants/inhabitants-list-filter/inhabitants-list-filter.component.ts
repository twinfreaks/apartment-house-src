import {Component, OnInit, EventEmitter, Output} from "@angular/core";
import {BuildingService} from "app/shared/services/building.service";
import {Building} from "app/shared/models/building.model";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SearchInhabitants} from "app/admin/admin-inhabitants/models/search-inhabitants.model";

@Component({
  selector: 'app-inhabitants-list-filter',
  templateUrl: './inhabitants-list-filter.component.html',
  styleUrls: ['./inhabitants-list-filter.component.scss']
})
export class InhabitantsListFilterComponent implements OnInit {
  @Output() searchInhabitants: EventEmitter<SearchInhabitants> = new EventEmitter<SearchInhabitants>();
  buildings: Building[];
  searchForm: FormGroup;

  constructor(private buildingService: BuildingService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      "surname": null,
      "phone": null,
      "building": null
    });

    this.buildingService.getAll()
        .subscribe(
            (buildings) => {
              function select2Refactor(building) {
                return {"id": building.id, "text": building.streetName + " " + building.buildingNumber};
              }
              this.buildings = _.map(buildings, select2Refactor);
            },
            (error) => {
              this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
            }
        )
  }

  search() {
    const searchClear = {
      "surname": this.searchForm.value.surname,
      "phone": this.searchForm.value.phone,
      "building": (this.searchForm.value.building !== null) ? this.searchForm.value.building[0].id : null,
    };
    this.searchInhabitants.next(searchClear);
  }

  clearForm() {
    const searchClear = {
      "surname": null,
      "phone": null,
      "building": null
    };
    this.searchForm.setValue(searchClear, {onlySelf: true});
    this.searchInhabitants.next(searchClear);
  }
}