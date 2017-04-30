import {Component, OnInit, ViewChild, EventEmitter, Output} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {Inhabitant} from "app/admin/admin-inhabitants/models/inhabitant.model";
import {InhabitantsService} from "app/admin/admin-inhabitants/services/inhabitants.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-inhabitant-activate-modal',
  templateUrl: './inhabitant-activate-modal.component.html'
})
export class InhabitantActivateModalComponent implements OnInit {
  @ViewChild('lgModal') modal: ModalDirective;
  @Output() activateInhabitant: EventEmitter<Inhabitant> = new EventEmitter<Inhabitant>();
  inhabitant: Inhabitant;
  lang: string;

  constructor(private inhabitantService: InhabitantsService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private language: LanguageTranslateService) { }

  ngOnInit() {
    this.lang = this.language.getCurrentLanguage();
  }

  activateConfirm(inhabitant: Inhabitant) {
    this.inhabitant = inhabitant;
    this.modal.show();
  }

  doActivateInhabitant(inhabitant: Inhabitant) {
    this.inhabitantService.setActive(inhabitant.id, this.lang)
      .subscribe(
        (data) => {
          this.activateInhabitant.next(inhabitant);
          this.modal.hide();
          if (data["data"] === 'email') {
            return this.toastr.success(this.translate.instant("INHABITANT_ACTIVATED_EMAILED"), this.translate.instant("INHABITANT_ACTIVATED"));
          }
          return this.toastr.success(this.translate.instant("INHABITANT_ACTIVATED_SMS"), this.translate.instant("INHABITANT_ACTIVATED"));
        },
        (error) => {
          this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
        }
      )
  }
}
