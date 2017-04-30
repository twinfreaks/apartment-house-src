import {Component, OnInit, ViewChild, EventEmitter, Output} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {Inhabitant} from "app/admin/admin-inhabitants/models/inhabitant.model";
import {InhabitantsService} from "app/admin/admin-inhabitants/services/inhabitants.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-inhabitant-inactivate-modal',
  templateUrl: './inhabitant-inactivate-modal.component.html'
})
export class InhabitantInactivateModalComponent implements OnInit {

  @ViewChild('lgModal') modal: ModalDirective;
  @Output() inActivateInhabitant: EventEmitter<Inhabitant> = new EventEmitter<Inhabitant>();
  inhabitant: Inhabitant;
  lang: string;

  constructor(private inhabitantService: InhabitantsService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private language: LanguageTranslateService) { }

  ngOnInit() {
    this.lang = this.language.getCurrentLanguage();
  }

  inActivateConfirm(inhabitant: Inhabitant) {
    this.inhabitant = inhabitant;
    this.modal.show();
  }

  doInActivateInhabitant(inhabitant: Inhabitant) {
    this.inhabitantService.setInActive(inhabitant.id, this.lang)
      .subscribe(
        (data) => {
          this.inActivateInhabitant.next(inhabitant);
          this.modal.hide();
          if (data["data"] === 'email') {
            return this.toastr.success(this.translate.instant("INHABITANT_INACTIVATED_EMAILED"), this.translate.instant("INHABITANT_INACTIVATED"));
          }
          return this.toastr.success(this.translate.instant("INHABITANT_INACTIVATED_SMS"), this.translate.instant("INHABITANT_INACTIVATED"));
        },
        (error) => {
          this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
        }
      )
  }
}
