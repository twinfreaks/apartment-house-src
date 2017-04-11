import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-page-not-found',
  template: `<div class="container space-top">
                <div class="row text-center vertical-center">
                    <div class="col-md-4 offset-md-4 col-12">
                        <img class="image-responsive" src="./../../assets/img/404.png">
                    </div>
                </div>
                <div class="row space-top">
                    <div class="col-12 text-center space-top">
                        <h3 [innerHTML]="notFoundText"></h3>
                        <button class="btn btn-primary" [routerLink]="['/']">{{"PASS_TO_HOME" | translate}}</button>
                    </div>
                </div>
            </div>`,
  styles: [`.vertical-center {
              padding-top: 10vh;
           }`]
})

export class PageNotFoundComponent implements OnInit {
  notFoundText: string;

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.translate.get("NOT_FOUND")
        .subscribe((data) => {this.notFoundText = data});
  }
}