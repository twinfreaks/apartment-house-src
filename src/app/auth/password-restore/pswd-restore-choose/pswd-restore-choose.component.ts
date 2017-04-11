import {Component, OnInit, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'app-pswd-restore-choose',
  templateUrl: 'pswd-restore-choose.component.html'
})
export class PswdRestoreChooseComponent implements OnInit {

  @Output()
  choosePswdRestore:EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  setChoose(type) {
    this.choosePswdRestore.emit(type);
  }

}
