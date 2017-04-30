import {browser, element, by, protractor} from 'protractor';
import * as moment from "moment/moment";
import * as _ from "lodash";

let EC = protractor.ExpectedConditions,
  sharedFunc = require('../shared/shared-function.ts'),
  addEditEventForm = require('./add-edit-event-form.ts'),
  date = require('../shared/date-formats'),
  adminFunc = require('./admin-function.ts');

exports.testAddDelete = () => {

  describe('Add and delete calendar event functionalities', () => {

    let eventTitle = 'With end event',
      eventDesc = 'Event added by e2e test with end date',
      eventNoEndTitle = 'No end event',
      eventNoEndDescription = 'Event added by e2e test with no end date',
      toast = element(by.className('toast-top-right')),
      modal = element(by.css('.modal')),
      modalClose = modal.element(by.css('.close')),
      startInput = element(by.css('p-calendar[formcontrolname=start] input')),
      endInput = element(by.css('p-calendar[formcontrolname=end] input')),
      noEndInput = element(by.id('withoutend')),
      subminBtn = element(by.css('button[type=submit]')),
      titleInput = element(by.css('input[formcontrolname=title]')),
      descInput = element(by.css('textarea[formcontrolname=description]')),
      firstDayOfMonth = moment().format(date.formats.firstDayOfMonth),
      secondDayOfMonth = moment().format(date.formats.secondDayOfMonth),
      day = element(by.css('.modal')),
      openDay = element(by.css('.cal-month-view .cal-open-day-events')),
      eventTitles, indexOfEvent, indexOfNoEndEvent;

    it('show add event component after click add event button', () => {
      element(by.css('button.add')).click();
      expect(element(by.id('add-edit-event')).isPresent()).toBe(true);
      expect(element(by.id('calendar-event')).isPresent()).toBe(false);
    });

    it('Add event title correct', () => {
      expect(element(by.css('.container > h3')).getText()).toBe('Add event');
    });

    addEditEventForm.testAddEditEventForm();

    it('Set values - title, description, start and end date', () => {
      startInput.clear();
      startInput.sendKeys(firstDayOfMonth);
      endInput.clear();
      endInput.sendKeys(secondDayOfMonth);
      titleInput.clear();
      titleInput.sendKeys(eventTitle);
      descInput.clear();
      descInput.sendKeys(eventDesc);
      expect(subminBtn.isEnabled()).toBe(true);
    });

    it('Show modal with correct data after click save button', () => {
      element(by.css('p-calendar[formcontrolname=end] .ui-datepicker')).isPresent().then((value) => {
        if (value) {
          element(by.css('p-calendar[formcontrolname=end] .ui-datepicker-trigger')).click();
        }
      });
      subminBtn.click();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
      expect(modal.element(by.css('.modal-title')).getText()).toContain(eventTitle);
      expect(modal.all(by.css('.modal-body div')).first().getText()).toContain(eventDesc);
      expect(modal.element(by.id('start-date')).getText()).toContain(moment(firstDayOfMonth, date.formats.datePicker).format(date.formats.fullDate));
      expect(modal.element(by.id('end-date')).getText()).toContain(moment(secondDayOfMonth, date.formats.datePicker).format(date.formats.fullDate));
    });

    adminFunc.confirmChanges();

    adminFunc.clickOnSuccessToast();

    it('show add event component after click add event button', () => {
      element(by.css('button.add')).click();
      expect(element(by.id('add-edit-event')).isPresent()).toBe(true);
      expect(element(by.id('calendar-event')).isPresent()).toBe(false);
    });

    it('Add event title correct', () => {
      expect(element(by.css('.container > h3')).getText()).toBe('Add event');
    });

    it('Set values - title, description, start date. Event without end date', () => {
      noEndInput.click();
      startInput.clear();
      startInput.sendKeys(firstDayOfMonth);
      titleInput.clear();
      titleInput.sendKeys(eventNoEndTitle);
      descInput.clear();
      descInput.sendKeys(eventNoEndDescription);
      expect(subminBtn.isEnabled()).toBe(true);
    });

    it('Show modal with correct data after click save button', () => {
      element(by.css('p-calendar[formcontrolname=end] .ui-datepicker')).isPresent().then((value) => {
        if (value) {
          element(by.css('p-calendar[formcontrolname=end] .ui-datepicker-trigger')).click();
        }
      });
      subminBtn.click();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
      expect(modal.element(by.css('.modal-title')).getText()).toContain(eventNoEndTitle);
      expect(modal.all(by.css('.modal-body div')).first().getText()).toContain(eventNoEndDescription);
      expect(modal.element(by.id('start-date')).getText()).toContain(moment(firstDayOfMonth, date.formats.datePicker).format(date.formats.fullDate));
      expect(modal.element(by.id('end-date')).isPresent()).toBe(false);
    });

    adminFunc.confirmChanges();

    adminFunc.clickOnSuccessToast();

    switchTo('user', 'user');

    sharedFunc.goToCalendarEventsViaNavbar('user');

    it('find first day of month with events', () => {
      browser.driver.wait(() => {
        return element.all(by.css(".cal-event")).first().isPresent();
      }, 4000);
      function check(className) {
        return (_.includes(className, 'cal-in-month') && _.includes(className, 'cal-has-events'));
      }

      let days = element.all(by.css('.cal-day-cell')),
        done = false;
      for (let i = 0; i < 28; i++) {
        days.get(i).getAttribute('class').then(function (value) {
          if (!done && check(value)) {
            done = true;
            day = days.get(i);
          }
        });
      }
    });

    it('open active day after click on day', () => {
      day.element(by.css('.cal-cell-top')).click();
      browser.wait(EC.visibilityOf(openDay), 4000);
      eventTitles = element.all(by.css('.cal-month-view .cal-open-day-events .cal-event-title'));
      browser.wait(EC.visibilityOf(eventTitles.get(0)), 4000);
      expect(openDay.isDisplayed()).toBe(true);
    });

    it('User see added events', () => {
      let withEnd = false;
      let noEnd = false;
      eventTitles.getText().then((values) => {
        _.forEach(values, (value, index) => {
          if (_.includes(value, eventTitle)) {
            indexOfEvent = index;
            withEnd = true;
          }
          if (_.includes(value, eventNoEndTitle)) {
            indexOfNoEndEvent = index;
            noEnd = true;
          }
        });
        expect(withEnd && noEnd).toBe(true);
      });
    });

    it('Event with end date has correct end date', () => {
      eventTitles.get(indexOfEvent).click();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
      expect(modal.element(by.id('start-date')).getText()).toContain(moment(firstDayOfMonth, date.formats.datePicker).format(date.formats.fullDate));
      expect(modal.element(by.id('end-date')).getText()).toContain(moment(secondDayOfMonth, date.formats.datePicker).format(date.formats.fullDate));
      modalClose.click();
      browser.driver.wait(() => {
        return element(by.tagName('body')).getAttribute('class').then(function (value) {
          return !_.includes(value, 'modal-open');
        });
      }, 4000);
      expect(modal.isDisplayed()).toBe(false);
    });

    it("Event with no end has not end date", () => {
      eventTitles.get(indexOfNoEndEvent).click();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
      expect(modal.element(by.id('start-date')).getText()).toContain(moment(firstDayOfMonth, date.formats.datePicker).format(date.formats.fullDate));
      expect(modal.element(by.id('end-date')).isPresent()).toBe(false);
      modalClose.click();
      browser.driver.wait(() => {
        return element(by.tagName('body')).getAttribute('class').then(function (value) {
          return !_.includes(value, 'modal-open');
        });
      }, 4000);
      expect(modal.isDisplayed()).toBe(false);
    });

    switchTo('adminReceptionist', 'user');

    sharedFunc.goToCalendarEventsViaNavbar('admin');

    let numOfEvents;

    it('Open active day on first day of month', () => {
      browser.driver.wait(() => {
        return element.all(by.css(".cal-event")).first().isPresent();
      }, 4000);
      let firstDay = element.all(by.css('.cal-day-cell.cal-in-month')).first();
      firstDay.element(by.css('.cal-cell-top')).click();
      browser.wait(EC.presenceOf(openDay), 4000);
      expect(openDay.isDisplayed()).toBe(true);
    });

    it('Admin see added events', () => {
      let withEnd = false;
      let noEnd = false;
      eventTitles.getText().then((values) => {
        numOfEvents = values.length;
        _.forEach(values, (value, index) => {
          if (_.includes(value, eventTitle)) {
            indexOfEvent = index;
            withEnd = true;
          }
          if (_.includes(value, eventNoEndTitle)) {
            indexOfNoEndEvent = index;
            noEnd = true;
          }
        });
        expect(withEnd && noEnd).toBe(true);
      });
    });

    it('Show modal after click delete icon on event with end date', () => {
      browser.wait(EC.elementToBeClickable(openDay.all(by.css('.red')).get(indexOfEvent)), 4000);
      browser.actions().mouseDown(openDay.all(by.css('.red')).get(indexOfEvent)).mouseUp().perform();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
    });

    adminFunc.confirmChanges();

    adminFunc.clickOnSuccessToast();

    it('Show modal after click delete icon on event with no end date', () => {
      if (indexOfEvent < indexOfNoEndEvent) {
        indexOfNoEndEvent--;
      }
      browser.wait(EC.elementToBeClickable(openDay.all(by.css('.red')).get(indexOfNoEndEvent)), 4000);
      browser.actions().mouseDown(openDay.all(by.css('.red')).get(indexOfNoEndEvent)).mouseUp().perform();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
    });

    adminFunc.confirmChanges();

    adminFunc.clickOnSuccessToast();

    it('Events are deleted', () => {
      expect(eventTitles.count()).toBe(numOfEvents - 2);
    });

    switchTo('user', 'user');

    sharedFunc.goToCalendarEventsViaNavbar('user');

    it('User can not see deleted events', () => {
      browser.driver.wait(() => {
        return element.all(by.css(".cal-event")).first().isPresent();
      }, 4000);
      let firstDay = element.all(by.css('.cal-day-cell.cal-in-month')).first();
      expect(firstDay.all(by.css('.cal-event')).count()).toBe(numOfEvents - 2);
    });

    function switchTo(role, pass) {
      it("Switch to " + role, () => {
        let profileMenu = element(by.id("single-button")),
          logoutBtn = element(by.css(".dropdown-menu-right > li:last-child")),
          loginInput = element(by.css('input[formControlName=username]')),
          passwordInput = element(by.css('input[formControlName=password]')),
          flags = element.all(by.css('.flag')),
          en = flags.get(0),
          uk = flags.get(1),
          toast = element(by.className('toast-top-right'));
        profileMenu.click();
        browser.wait(EC.visibilityOf(logoutBtn), 5000);
        logoutBtn.click();
        browser.wait(EC.visibilityOf(toast), 5000);
        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'login');
        toast.click();
        browser.wait(EC.invisibilityOf(toast), 5000);
        expect(toast.isDisplayed()).toBe(false);
        browser.wait(EC.presenceOf(loginInput), 5000);
        expect(loginInput.isPresent()).toBe(true);
        browser.wait(EC.elementToBeClickable(en), 5000);
        en.click();
        let signin = element(by.css('a[href="/registration"]'));
        expect(signin.getText()).toContain('Sign in');
        passwordInput.sendKeys(pass);
        loginInput.sendKeys(role);
        let submitBtn = element(by.name('submit'));
        submitBtn.click();
        browser.wait(EC.presenceOf(toast), 5000);
        browser.wait(EC.presenceOf(toast.element(by.className('toast-message'))), 5000);
        toast.click();
        browser.wait(EC.invisibilityOf(toast), 5000);
        expect(toast.isDisplayed()).toBe(false);
      });
    }
  });
}