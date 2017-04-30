import {Component, ViewChild, Input} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {AppConfig} from "../../../app.config";

@Component({
    selector: 'dashboard-modal',
    templateUrl: './dashboard-modal.component.html',
    styleUrls: ['./dashboard-modal.component.css']
})
export class DashboardModalComponent {
    @Input() modalData;
    @ViewChild('dashboardModal') public modal: ModalDirective;

    apiFiles = this.config.getConfig('files') + '/protocols/';
    constructor(private config: AppConfig) {
    }

    pdfPage: number = 1;

    nextPage() {
        this.pdfPage++;
    }

    prevPage() {
        this.pdfPage < 1 ? this.pdfPage = 1 : this.pdfPage--;
    }

    public showModal(): void {
        this.modal.show();
    }

    public hideModal(): void {
        this.modal.hide();
    }

}
