import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {
  @Input() duration: number = 100;
  @Input() show: boolean = true;
  @Output() scrollBegin: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() scrollEnd: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
  }

  scrollToTop(){
    let t = this,
        y = pageYOffset,
        step = (pageYOffset * 10)/t.duration,
        timer;
    timer = setInterval(function(){
      scrollTo(0, pageYOffset - step);
      if(pageYOffset <= step){
        t.scrollEnd.emit(true);
        scrollTo(0, 0);
        clearInterval(timer);
      }
    }, 10);
    t.scrollBegin.emit(true);
  }

}
