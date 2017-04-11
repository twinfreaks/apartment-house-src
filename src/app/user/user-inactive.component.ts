import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-user-inactive',
  template: `<div class="container space-top">
                <div class="row text-center">
                    <div class="col-md-4 offset-md-4 col-12">
                        <img class="image-responsive" src="./../../assets/img/access_denied.png">
                    </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="alert alert-warning">
                       <div [innerHTML]="inactiveText"></div>
                    </div>
                  </div>
                </div>
              </div>`
})
export class UserInactiveComponent implements OnInit {
  inactiveText: string;

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.translate.get("YOUR_ACCOUNT_IS_INACTIVE")
        .subscribe(
            (data) => {
              this.inactiveText = data
            }
        );
  }
}
