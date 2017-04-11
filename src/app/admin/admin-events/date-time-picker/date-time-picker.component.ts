import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {NgbDateStruct, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css']
})
export class DateTimePickerComponent implements OnInit {
  @Input() placeholder: string;
  @Input() date: Date;
  @Output() dateChange: EventEmitter<Date> = new EventEmitter();
  dateStruct: NgbDateStruct;
  timeStruct: NgbTimeStruct;
  locale: string;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
  }

  updateDate(): void {
    const newDate: Date = moment({
      "year": this.dateStruct.year,
      "month": this.dateStruct.month - 1,
      "date": this.dateStruct.day,
      "hour": this.timeStruct.hour,
      "minute": this.timeStruct.minute
    }).toDate();
    this.dateChange.emit(newDate);
  }

  updateTime(): void {
    const newDate: Date = moment({
      "year": this.dateStruct.year,
      "month": this.dateStruct.month - 1,
      "date": this.dateStruct.day,
      "hour": this.timeStruct.hour,
      "minute": this.timeStruct.minute
    }).toDate();
    this.dateChange.emit(newDate);
  }
}
