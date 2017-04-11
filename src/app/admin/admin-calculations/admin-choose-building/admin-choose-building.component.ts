import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {BuildingService} from "app/shared/services/building.service";
import {Building} from "app/shared/models/building.model";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";

@Component({
  selector: 'app-admin-choose-building',
  templateUrl: './admin-choose-building.component.html',
  styleUrls: ['./admin-choose-building.component.css']
})
export class AdminChooseBuildingComponent implements OnInit {
  @Input() choosenBuilding: Building = null;
  @Output() changeStep: EventEmitter<number> = new EventEmitter<number>();
  @Output() chooseBuilding: EventEmitter<Building> = new EventEmitter<Building>();
  choosen: number;
  addBuilding: Boolean = false;
  buildings: Building[] = [];
  sbuildings: any = [];

  constructor(private buildingService: BuildingService,
              private toastrService: ToastrService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    (this.choosenBuilding) ? this.choosen = this.choosenBuilding.id : this.choosen = 0;
    this.buildingService.getAll()
        .subscribe(
            (buildings) => {
              let t = this;
              this.sbuildings = _.map(buildings, t.initSelectItem);
              this.buildings = buildings;
            },
            (err) => {
              this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
            }
        )
  }

  initSelectItem(building) {
    return {"id": building.id, "text": building.streetName + " " + building.buildingNumber};
  }

  emitChooseBuilding(id: number) {
    this.choosen = id;
    this.chooseBuilding.emit(this.findBuildingById(id));
  }

  emitChangeStep(step: number) {
    this.changeStep.emit(step);
  }

  findBuildingById(id: number): Building {
    for (let i = 0; i < this.buildings.length; i++) {
      if (this.buildings[i].id == id) {
        return this.buildings[i];
      }
    }
    return null;
  }

  updateBuilding(building: Building) {
    this.addBuilding = false;
    this.buildingService.postBulding(building)
        .subscribe(
            (data) => {
              this.buildings.push(data);
              this.sbuildings = _.map(this.buildings, this.initSelectItem);
              this.toastrService.success(this.translateService.instant('CHANGES_SAVED'), this.translateService.instant('SUCCESS_ADD_BUILDING'));
            },
            (err) => {
              this.toastrService.error(err.toString(), this.translateService.instant("ERROR_OCCURED"));
            }
        )
  }

}
