import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings.service";
import {UserLogsService} from "../user-logs.service";
import {AppConfig} from "../../../app.config";

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.scss']
})
export class UserSettingsPageComponent implements OnInit {
  currentTheme: string;
  logs: Array<any>;
  dateFormat: string;

  constructor(private settingsService: SettingsService,
              private userLogsService: UserLogsService,
              private config: AppConfig) { }

  ngOnInit() {
    this.dateFormat = this.config.getConfig("dateFormat").fullDate;
    this.settingsService.theme.subscribe((theme) => this.currentTheme = theme);
    this.userLogsService.getAllLogs()
      .subscribe(
        (logs) => {this.logs = logs},
        (err) => {}
      )
  }

  setTheme(theme: string) {
    this.settingsService.setTheme(theme)
      .subscribe(
        (data) => {},
        (err) => {console.log(err);}
      );
  }

}
