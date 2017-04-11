import {Component, OnInit, Input} from "@angular/core";
import {ViberService} from "../../shared/services/viber-service";

@Component({
  selector: 'viber',
  templateUrl: './viber.component.html',
  styleUrls: ['./viber.component.scss']
})
export class ViberComponent implements OnInit {
  viberHeight = 0;
  @Input() viberData;

  constructor(private viberService: ViberService) {
  }

  ngOnInit() {
    this.viberService.getPAInfo().subscribe();
  }

  shareViaViber(message: string) {
    if (this.viberHeight) {
      this.viberService.sendMessages(message).subscribe()
    }
  }

  closeViberWindow() {
    this.viberHeight = 0;
  }
}
