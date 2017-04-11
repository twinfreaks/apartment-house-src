import {Component, OnInit} from "@angular/core";
import {InhabitantsService} from "app/admin/admin-inhabitants/services/inhabitants.service";
import {Inhabitant} from "app/admin/admin-inhabitants/models/inhabitant.model";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";
import {SearchInhabitants} from "app/admin/admin-inhabitants/models/search-inhabitants.model";

@Component({
  selector: 'app-inhabitants-tabs',
  templateUrl: './inhabitants-tabs.component.html'
})
export class InhabitantsTabsComponent implements OnInit {
  inhabitantsInactive: Inhabitant[] = [];
  inhabitantsAll: Inhabitant[] = [];

  constructor(private inhabitantService: InhabitantsService,
              private toastr: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.getAllInhabitants();
  }

  activateInhabitantHandler(inhabitant: Inhabitant) {
    let indexInhabitant = this.inhabitantsInactive.indexOf(inhabitant);
    this.inhabitantsInactive.splice(indexInhabitant, 1);
    let indexInhabitantAll = this.inhabitantsAll.indexOf(inhabitant);
    this.inhabitantsAll.splice(indexInhabitantAll, 1);
    let inhabitantActivated = inhabitant;
    inhabitantActivated.isActive = true;
    this.inhabitantsInactive.push(inhabitantActivated);
    this.inhabitantsAll.push(inhabitantActivated);
  }

  inActivateInhabitantHandler(inhabitant: Inhabitant) {
    let indexInhabitant = this.inhabitantsInactive.indexOf(inhabitant);
    this.inhabitantsInactive.splice(indexInhabitant, 1);
    let indexInhabitantAll = this.inhabitantsAll.indexOf(inhabitant);
    this.inhabitantsAll.splice(indexInhabitantAll, 1);
    let inhabitantActivated = inhabitant;
    inhabitantActivated.isActive = false;
    this.inhabitantsInactive.push(inhabitantActivated);
    this.inhabitantsAll.push(inhabitantActivated);
  }

  deleteInhabitantHandler(inhabitant: Inhabitant) {
    let indexInhabitant = this.inhabitantsInactive.indexOf(inhabitant);
    this.inhabitantsInactive.splice(indexInhabitant, 1);
    let indexInhabitantAll = this.inhabitantsAll.indexOf(inhabitant);
    this.inhabitantsAll.splice(indexInhabitantAll, 1);
  }

  searchInhabitantsHandler(searchInhabitants: SearchInhabitants) {
    this.getAllInhabitants(searchInhabitants);
  }

  getAllInhabitants(searchInhabitants?: SearchInhabitants) {
    this.inhabitantService.getAll(searchInhabitants)
      .subscribe(
        (inhabitants) => {
          this.inhabitantsAll = inhabitants;
          this.inhabitantsInactive = _.filter(inhabitants, {isActive: false})
        },
        (error) => {
          this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
        }
      );
  }
}
