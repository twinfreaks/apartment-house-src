import {browser, element, by, protractor} from 'protractor';
import * as moment from "moment/moment";
import * as _ from "lodash";

let EC = protractor.ExpectedConditions,
    dateFormats = require('../shared/date-formats');

exports.testCalendarMenu = () => {

  describe('test calendar menu', () => {

    let title = element(by.css('.breadcrumb h3.title'));
    let monthView = element(by.css('div.cal-month-view'));
    let weekView = element(by.css('div.cal-week-view'));
    let dayView = element(by.css('div.cal-day-view'));
    let periodTitle = element(by.id('period-title'));
    let prevBtn = element(by.id('date-nav-prev'));
    let todayBtn = element(by.id('date-nav-today'));
    let nextBtn = element(by.id('date-nav-next'));
    let monthBtn = element(by.id('view-nav-month'));
    let weekBtn = element(by.id('view-nav-week'));
    let dayBtn = element(by.id('view-nav-day'));

    it("title is correct", () => {
      expect(title.getText()).toBe("Events calendar");
    });

    it("default month view", () => {
      expect(monthView.isPresent()).toBe(true);
      expect(weekView.isPresent()).toBe(false);
      expect(dayView.isPresent()).toBe(false);
    });

    it("default display current month", () => {
      expect(periodTitle.getText()).toBe(moment().format(dateFormats.formats.month));
    });

    it("one month in past", () => {
      prevBtn.click();
      expect(periodTitle.getText()).toBe(moment().subtract(1, 'months').format(dateFormats.formats.month));
    });

    it("two month in past", () => {
      prevBtn.click();
      expect(periodTitle.getText()).toBe(moment().subtract(2, 'months').format(dateFormats.formats.month));
    });

    it("go to today", () => {
      todayBtn.click();
      expect(periodTitle.getText()).toBe(moment().format(dateFormats.formats.month));
    });

    it("one month in future", () => {
      nextBtn.click();
      expect(periodTitle.getText()).toBe(moment().add(1, 'months').format(dateFormats.formats.month));
    });

    it("two month in future", () => {
      nextBtn.click();
      expect(periodTitle.getText()).toBe(moment().add(2, 'months').format(dateFormats.formats.month));
    });

    it("go to today", () => {
      todayBtn.click();
      expect(periodTitle.getText()).toBe(moment().format(dateFormats.formats.month));
    });

    it("week view work", () => {
      weekBtn.click();
      expect(monthView.isPresent()).toBe(false);
      expect(weekView.isPresent()).toBe(true);
      expect(dayView.isPresent()).toBe(false);
    });

    it("week view title correct", () => {
      expect(periodTitle.getText()).toContain(moment().format(dateFormats.formats.week));
    });

    it("day view work", () => {
      dayBtn.click();
      expect(monthView.isPresent()).toBe(false);
      expect(weekView.isPresent()).toBe(false);
      expect(dayView.isPresent()).toBe(true);
    });

    it("day view title correct", () => {
      expect(periodTitle.getText()).toBe(moment().format(dateFormats.formats.day));
    });

    it("month view work", () => {
      monthBtn.click();
      expect(monthView.isPresent()).toBe(true);
      expect(weekView.isPresent()).toBe(false);
      expect(dayView.isPresent()).toBe(false);
    });

    it("month view title correct", () => {
      expect(periodTitle.getText()).toBe(moment().format(dateFormats.formats.month));
    });
  });
}