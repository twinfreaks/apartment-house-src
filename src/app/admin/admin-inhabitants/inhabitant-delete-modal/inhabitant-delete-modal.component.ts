import {Component, OnInit, ViewChild, EventEmitter, Output} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {Inhabitant} from "app/admin/admin-inhabitants/models/inhabitant.model";
import {InhabitantsService} from "app/admin/admin-inhabitants/services/inhabitants.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {LanguageTranslateService} from "app/shared/language-translate.service";

@Component({
  selector: 'app-inhabitant-delete-modal',
  templateUrl: './inhabitant-delete-modal.component.html'
})
export class InhabitantDeleteModalComponent implements OnInit {
  @ViewChild('lgModal') modal: ModalDirective;
  @Output() deleteInhabitant: EventEmitter<Inhabitant> = new EventEmitter<Inhabitant>();
  inhabitant: Inhabitant;
  lang: string;

  constructor(private inhabitantService: InhabitantsService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private language: LanguageTranslateService) { }

  ngOnInit() {
    this.lang = this.language.getCurrentLanguage();
  }

  deleteConfirm(inhabitant: Inhabitant) {
    this.inhabitant = inhabitant;
    this.modal.show();
  }

  doDeleteInhabitant(inhabitant: Inhabitant) {
    this.inhabitantService.removeInhabitant(inhabitant.id, this.lang)
      .subscribe(
        (data) => {
          this.deleteInhabitant.next(inhabitant);
          this.modal.hide();
          if (data["data"] === 'email') {
            return this.toastr.success(this.translate.instant("INHABITANT_DELETED_EMAILED"), this.translate.instant("INHABITANT_DELETED"));
          }
          return this.toastr.success(this.translate.instant("INHABITANT_DELETED_SMS"), this.translate.instant("INHABITANT_DELETED"));
        },
        (error) => {
          this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
        }
      )
  }
}
