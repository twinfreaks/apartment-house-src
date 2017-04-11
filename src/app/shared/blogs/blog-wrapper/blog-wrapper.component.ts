import {Component, OnInit} from "@angular/core";
import {trigger, state, style, transition, animate} from "@angular/animations";

@Component({
  selector:    'app-blog-wrapper',
  templateUrl: 'blog-wrapper.component.html',
  animations:  [
    trigger('animate', [
      state('in', style({
        opacity: '1'
      })),
      state('out', style({
        opacity: '0.2',
      })),
      transition('* => *', animate(400))
    ])
  ]
})
export class BlogWrapperComponent implements OnInit {
  
  animState: string = 'in';

  constructor() { }

  ngOnInit() {
  }
  
  changeState() {
    this.animState = 'out';
    setTimeout( () => this.animState = 'in' , 250 );
  }
}