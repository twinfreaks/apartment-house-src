import {Component, OnInit} from "@angular/core";
import {AuthAppService} from "app/auth/services/auth-app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-root',
  templateUrl: './user-root.component.html',
  styleUrls: ['./user-root.component.css']
})
export class UserRootComponent implements OnInit {
  isInhabitantActive: boolean;

  constructor(private appAuth: AuthAppService,
              private router: Router) {
  }

  ngOnInit() {
    this.isInhabitantActive = this.appAuth.getIsInhabitantActive();
    if (!this.isInhabitantActive) {
      this.router.navigate(['user/inactive']);
    }
  }
}
