import {Component, OnInit, ViewChild, Input} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss']
})
export class GalleryModalComponent implements OnInit {
  @ViewChild('lgModal') public modal: ModalDirective;
  @Input() photoUrl = null;
  constructor() { }

  ngOnInit() {
  }
  show() {
    this.modal.show();
  }
}
