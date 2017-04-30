import {Component, OnInit, Input, EventEmitter, Output, SimpleChanges} from "@angular/core";
import {Building} from "app/shared/models/building.model";
import {TranslateService} from "@ngx-translate/core";
import * as _ from "lodash";

@Component({
  selector: 'app-add-edit-building',
  templateUrl: './add-edit-building.component.html'
})
export class AddEditBuildingComponent implements OnInit {

  @Input() building: Building = null;
  @Output() updateBuilding: EventEmitter<Building> = new EventEmitter<Building>();
  @Output() cancel: EventEmitter<Building> = new EventEmitter<Building>();
  newBuilding: Building = {streetName: '', buildingNumber: ''};

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    (this.building) ? this.newBuilding = this.building : this.newBuilding = {streetName: '', buildingNumber: ''};
  }

  ngOnChanges(changes: SimpleChanges) {
    this.newBuilding = (changes['building'] && this.building) ? this.building : this.newBuilding;
  }

  setNewBuilding(property: string, value: any) {
    this.newBuilding[property] = value;
  }

  onSubmit() {
    let builbingToEmit;
    if (this.building && this.building.id) {
      builbingToEmit = this.building;
      _.forOwn(this.newBuilding, function (value, key) {
        builbingToEmit[key] = value;
      });
    } else {
      builbingToEmit = this.newBuilding;
    }
    this.updateBuilding.emit(builbingToEmit);
    return false;
  }

  emitCancel() {
    this.cancel.emit(this.newBuilding);
  }
}
