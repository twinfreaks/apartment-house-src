import {Directive, HostListener, Input, Output, EventEmitter} from "@angular/core";

@Directive({
  selector: '[scrollChat]'
})
export class ScrollChatDirective {

  @Input() scrollChat: number;
  lastScrollTop: number = 0;
  scrollDirection: string;
  scrollIsNewMove: boolean = false;
  @Output() isScrolledUp: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @HostListener('scroll', ['$event'])
  onScroll(event): void {
    let tracker = event.target,
      scrollTop = tracker.scrollTop,
      chatHeight = tracker.clientHeight,
      offset = chatHeight - scrollTop,
      toTop = chatHeight - offset;

    if (scrollTop > this.lastScrollTop) {
      this.scrollDirection = "down";
      this.scrollIsNewMove = false;
    }
    else {
      this.scrollDirection = "up";
      this.scrollIsNewMove = true;
    }

    this.lastScrollTop = scrollTop;

    if (toTop < this.scrollChat && this.scrollIsNewMove) {
      this.isScrolledUp.next(true);
    }
  };

  constructor() {
  }
}
