import {Component, OnInit} from "@angular/core";
import {Building} from "app/shared/models/building.model";
import {CalculationType} from "app/shared/models/calculation-type.model";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-admin-calculations-root',
  templateUrl: './admin-calculations-root.component.html',
  styleUrls: ['./admin-calculations-root.component.css']
})
export class AdminCalculationsRootComponent implements OnInit {

  step: number = 1;
  building: Building = null;
  calculationType: CalculationType = null;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
  }

  changeStep(step: number) {
    this.step = step;
    return false;
  }

  setBuilding(event) {
    this.building = event;
  }

  setCalculationType(event) {
    this.calculationType = event;
  }
}
