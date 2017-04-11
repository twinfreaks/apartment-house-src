import {Component, OnInit} from "@angular/core";
import * as moment from "moment";
import * as _ from "lodash";
import {Protocol} from "../models/protocol";
import {ProtocolHttpService} from "../services/protocol-http.service";
import {AppConfig} from "../../app.config";
import {AuthAppService} from "../../auth/services/auth-app.service";
import {DashboardHttpService} from "../services/dashboard-http.service";

@Component({
  selector: 'app-protocols',
  templateUrl: 'protocols.component.html',
  styleUrls: ['protocols.component.scss']
})
export class ProtocolsComponent implements OnInit {

  protocols: Protocol[] = [];
  protocolModel = new Protocol();
  modalData: any;
  uploadUrl = this.config.getConfig('api') + `/upload`;
  apiFiles = this.config.getConfig('api') + '/protocols/';
  dateFormatter = this.config.getConfig('dateFormat');
  collapseHeight = 0;
  inhabitantId: number = null;
  role = null;

  constructor(private protocolService: ProtocolHttpService,
              private config: AppConfig,
              private authService: AuthAppService,
              private dashboardService: DashboardHttpService) {
  }

  ngOnInit() {
    this.getInhabitantId();
    this.getRoles();
    this.getProtocols();
  }

  getInhabitantId() {
    this.authService.inhabitantIdSub.subscribe(
      (data) => {
        this.inhabitantId = data;
      }
    )
  }

  getRoles() {
    this.authService.rolesSub.subscribe(
      (data) => {
        if (data) this.role = data[0];
      }
    )
  }

  getProtocols() {
    this.protocolService.getProtocols()
      .subscribe(
        (protocols) => {
          this.protocols = protocols['data'];
          this.protocols = _.orderBy(this.protocols, ['updatedAt'], ['desc']);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  postProtocol() {
    this.protocolService.postProtocol(this.protocolModel).subscribe(
      (data) => this.getProtocols()
    )
  }

  updateProtocol() {
    this.protocolService.updateProtocol(this.protocolModel).subscribe(
      (data) => this.getProtocols()
    )
  }

  setIsActive(obj: any) {
    this.protocolService.setIsActive(obj).subscribe()
  }

  deleteProtocol(id: number) {
    this.protocolService.deleteProtocolById(id).subscribe(
      (data) => this.getProtocols()
    )
  }

  onSubmit() {
    this.protocolModel.id ? this.updateProtocol() : this.postProtocol();
    this.closeCollapse();
  }

  readProtocol(protocol: Protocol) {
    this.dashboardService.setStatusReaded('viewProtocol', this.inhabitantId, protocol.id).subscribe()
  }

  setModalData(obj: any) {
    this.modalData = obj;
  }

  addDest(formData) {
    formData.append('destination', 'protocols')
  }

  filenameToModel(event) {
    this.protocolModel.fileUrl = JSON.parse(event.response)[0].filename;
  }

  onActive(protocol: Protocol) {
    protocol.isActive = !protocol.isActive;
  }

  newProtocolModel() {
    this.protocolModel = new Protocol();
  }

  editProtocol(protocol: Protocol) {
    this.protocolModel = protocol;
  }

  closeCollapse() {
    this.collapseHeight = 0
  }

  openCollapse(){
    if (!this.collapseHeight) this.collapseHeight = 1000
  }

  isInhabitant() {
    return (this.role === 'inhabitant')
  }

  format(date: any) {
    return moment(date).format(this.dateFormatter.fullWithoutHour)
  }
}
