import {Component, OnInit} from "@angular/core";
import {DragulaService} from "ng2-dragula";
import * as moment from "moment";
import {Blog} from "../../../shared/models/blog";
import {Protocol} from "../../../shared/models/protocol";
import {CalendarEvent} from "../../../shared/models/calendar-event";
import {Calculation} from "../../../shared/models/calculation.model";
import {CalculationType} from "../../../shared/models/calculation-type.model";
import {DashboardConfig} from "../dashboard-config";
import {DashboardHttpService} from "../../../shared/services/dashboard-http.service";
import {AuthAppService} from "../../../auth/services/auth-app.service";
import {AppConfig} from "../../../app.config";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  modalData: any;
  configHeight = 0;
  requestEnd: boolean = true;
  lastBlogs: Blog[] = [];
  lastEvents: CalendarEvent[] = [];
  lastProtocols: Protocol[] = [];
  lastCalculations: Calculation[] = [];
  calculationTypes: CalculationType[] = [];
  viewOrderArr = [];
  lastItems = new Map();
  viewItems = new Map();
  itemsTitles = new Map();
  inhabitantId: number;
  unreadedBlogsCount: number = null;
  unreadedEventsCount: number = null;
  unreadedProtocolsCount: number = null;
  unreadedCalculationsCount: number = null;
  dashboardConfig = new DashboardConfig();
  dateFormatter = this.config.getConfig('dateFormat');
  apiFiles = this.config.getConfig('api') + '/protocols/';
  imageUrl = `${this.config.getConfig('api')}/calculation-types`;

  constructor(private dashboardService: DashboardHttpService,
              private authService: AuthAppService,
              private dragulaService: DragulaService,
              private config: AppConfig) {
    dragulaService.dropModel.subscribe((value) => {
      this.setUserConfig();
      this.requestEnd = false;
    })
  }

  ngOnInit() {
    this.getUserId();
    this.getInhabitantId();
    this.getUserConfig();
    this.getUnreadedBlogsCount(this.inhabitantId);
    this.getUnreadedEventsCount(this.inhabitantId);
    this.getUnreadedProtocolsCount(this.inhabitantId);
    this.getUnreadedCalculationsCount(this.inhabitantId);
  }

  getUserConfig() {
    this.dashboardService.getUserConfig(this.dashboardConfig.userID)
        .subscribe(
            data => {
              if (data['code'] === 200) {
                this.dashboardConfig = data['data'];
                this.requestEnd = true;
              } else {
                this.dashboardConfig.viewOrder = '[1, 2, 3, 4]';
              }
              this.viewOrderArr = JSON.parse(this.dashboardConfig.viewOrder);
              this.getLastBlogs();
              this.getLastEvents();
              this.getLastProtocols();
              this.getLastCalculations();
            }
        )
  }

  getInhabitantId() {
    this.inhabitantId = this.authService.getInhabitantId();
  }

  getUserId() {
    this.dashboardConfig.userID = this.authService.getUserId();
  }

  getLastBlogs() {
    this.dashboardService.getLastBlogs(this.dashboardConfig.blogsCount)
        .subscribe(
            (blog) => {
              this.lastBlogs = blog['data'];
              this.lastItems.set(1, this.lastBlogs);
              this.viewItems.set(1, this.dashboardConfig.viewBlogs);
              this.itemsTitles.set(1, 'BLOGS');
            }
        )
  }

  getLastEvents() {
    this.dashboardService.getLastEvents(this.dashboardConfig.eventsCount)
        .subscribe(
            (event) => {
              this.lastEvents = event['data'];
              this.lastItems.set(2, this.lastEvents);
              this.viewItems.set(2, this.dashboardConfig.viewEvents);
              this.itemsTitles.set(2, 'EVENTS');
            }
        )
  }

  getLastProtocols() {
    this.dashboardService.getLastProtocols(this.dashboardConfig.protocolsCount)
        .subscribe(
            (protocol) => {
              this.lastProtocols = protocol['data'];
              this.lastItems.set(3, this.lastProtocols);
              this.viewItems.set(3, this.dashboardConfig.viewProtocols);
              this.itemsTitles.set(3, 'PROTOCOLS');
            }
        )
  }

  getLastCalculations() {
    this.dashboardService.getLastCalculations(this.inhabitantId)
        .subscribe(
            (calculation) => {
              this.lastCalculations = calculation['data'];
              this.calculationTypes = calculation['dataTypes'];
              this.lastItems.set(4, this.lastCalculations);
              this.viewItems.set(4, this.dashboardConfig.viewCalculations);
              this.itemsTitles.set(4, 'CALCULATIONS');
            }
        )
  }

  getCalculationType(calc: Calculation) {
    return this.calculationTypes[this.calculationTypes.findIndex(
        (type: CalculationType) => type.id === calc.calculationType
    )];
  }

  isCalculation(obj: any) {
    return !!obj.calculationType;
  }

  getUnreadedBlogsCount(id: number) {
    this.dashboardService.getUnreadedBlogsCount(id)
        .subscribe(
            (count) => {
              this.unreadedBlogsCount = count['data'];
            }
        )
  }

  getUnreadedEventsCount(id: number) {
    this.dashboardService.getUnreadedEventsCount(id)
        .subscribe(
            (count) => {
              this.unreadedEventsCount = count['data'];
            }
        )
  }

  getUnreadedProtocolsCount(id: number) {
    this.dashboardService.getUnreadedProtocolsCount(id)
        .subscribe(
            (protocol) => {
              this.unreadedProtocolsCount = protocol['data'];
            }
        )
  }

  getUnreadedCalculationsCount(id: number) {
    this.dashboardService.getUnreadedCalculationsCount(id)
        .subscribe(
            (calculation) => {
              this.unreadedCalculationsCount = calculation['data'];
            }
        )
  }

  checkNewCalcs() {
    return !!this.unreadedCalculationsCount
  }

  setModalData(obj: any) {
    this.modalData = obj;
  }

  readBlog(blog: Blog) {
    this.dashboardService.setStatusReaded('viewBlog', this.inhabitantId, blog.id).subscribe(
        (data) => this.getUnreadedBlogsCount(this.inhabitantId)
    )
  }

  readEvent(event: CalendarEvent) {
    this.dashboardService.setStatusReaded('viewEvent', this.inhabitantId, event.id).subscribe(
        (data) => this.getUnreadedEventsCount(this.inhabitantId)
    )
  }

  readProtocol(protocol: Protocol) {
    this.dashboardService.setStatusReaded('viewProtocol', this.inhabitantId, protocol.id).subscribe(
        (data) => this.getUnreadedProtocolsCount(this.inhabitantId)
    )
  }

  readItem(n: number, item: any) {
    switch (n) {
      case 1:
        this.readBlog(item);
        break;
      case 2:
        this.readEvent(item);
        break;
      case 3:
        this.readProtocol(item);
        break;
    }
  }

  setUserConfig() {
    this.dashboardConfig.viewOrder = JSON.stringify(this.viewOrderArr);
    this.dashboardService.setUserConfig(this.dashboardConfig).subscribe(
        (data) => {
          this.requestEnd = false;
          this.getUserConfig()
        }
    )
  }

  format(date: any) {
    return moment(date).format(this.dateFormatter.fullWithoutHour)
  }

  calcsDate(date) {
    return moment(date).format(this.dateFormatter.dateSlash);
  }
}
