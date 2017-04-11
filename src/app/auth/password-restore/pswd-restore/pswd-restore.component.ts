import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-pswd-restore',
  template: `
            <div class="container space-top">
              <div class="row">
                <div class="col-12">
                  <h1>{{"RESTORE_PASSWORD" | translate}}</h1>
                </div>
              </div>
              <div class="row align-content-center space-top">
               <div class="col">
                    <button *ngIf="type == 'email' || type == 'phone'" (click)="goBack()" class="btn btn-secondary"><i class="fa fa-angle-left"></i> {{"BACK" | translate}}</button>
                </div>
             </div>
              <div class="row space-top">
                <div class="col-12">
                   <app-pswd-restore-choose *ngIf="type == 'choose'" (choosePswdRestore)="handleChoosePswdRestore($event)"></app-pswd-restore-choose>
                   <app-pswd-restore-email-partial *ngIf="type == 'email'" (chooseEmailSent)="handleChoosePswdRestore($event)"></app-pswd-restore-email-partial>
                   <app-pswd-restore-phone-partial *ngIf="type == 'phone'" (chooseEmailSent)="handleChoosePswdRestore($event)"></app-pswd-restore-phone-partial>
                   <app-pswd-emailsent-partial *ngIf="type == 'emailSent'"></app-pswd-emailsent-partial>
                   <app-pswd-phonesent-partial *ngIf="type == 'phoneSent'"></app-pswd-phonesent-partial>
                </div>
              </div>
            </div>
`
})
export class PswdRestoreComponent implements OnInit {

  type: string = 'choose';

  constructor() {
  }

  ngOnInit() {
  }

  handleChoosePswdRestore(choosen) {
    this.type = choosen;
  }

  goBack(){
    this.type = 'choose';
  }

}
