import {browser, element, by, protractor} from 'protractor';
import * as _ from "lodash";

let EC = protractor.ExpectedConditions,
    sharedFunc = require('../shared/shared-function.ts');

exports.testClickable = () => {

  describe('test clickability for user', () => {

    let day = element(by.css('.modal')),
        openDay = element(by.css('.cal-month-view .cal-open-day-events')),
        modal = element(by.css('.modal')),
        modalClose = modal.element(by.css('.close')),
        eventTitle;

    it('find first day of month with events', () => {
      function check(className){
        return (_.includes(className, 'cal-in-month') && _.includes(className, 'cal-has-events'));
      }
      let days = element.all(by.css('.cal-day-cell')),
          done = false;
      for(let i = 0; i < 28; i++){
        days.get(i).getAttribute('class').then((value) => {
          if(!done && check(value)){
            done = true;
            day = days.get(i);
          }
        });
      }
    });

    it('open active day after click on day', () => {
      day.element(by.css('.cal-cell-top')).click();
      browser.wait(EC.visibilityOf(openDay), 4000);
      eventTitle = element.all(by.css('.cal-month-view .cal-open-day-events .cal-event-title')).first();
      browser.wait(EC.visibilityOf(eventTitle), 4000);
      expect(openDay.isDisplayed()).toBe(true);
    });

    it('show modal after click on event title on active day open', () => {
      eventTitle.click();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
      expect(modal.isDisplayed()).toBe(true);
    });

    it('correct data in modal window', () => {
      let modalHeader = element(by.css('.modal-title'));
      expect(eventTitle.getText()).toBe(modalHeader.getText());
    }); 

    it('close modal', () => {
      modalClose.click();
      browser.driver.wait(() => {
        return element(by.tagName('body')).getAttribute('class').then((value) => {
          return !_.includes(value, 'modal-open');
        });
      });
      expect(modal.isDisplayed()).toBe(false);
    });

    it('close active day after click on day', () => {
      day.element(by.css('.cal-cell-top')).click();
      browser.wait(EC.stalenessOf(openDay), 4000);
      expect(openDay.isPresent()).toBe(false);
    });

    it('show modal after click on event', () => {
      day.element(by.css('.cal-event:nth-child(1)')).click();
      browser.wait(EC.elementToBeClickable(modalClose), 4000);
      expect(modal.isDisplayed()).toBe(true);
    });

    it('close modal', () =>{
      modalClose.click();
      browser.driver.wait(() => {
        return element(by.tagName('body')).getAttribute('class').then((value) => {
          return !_.includes(value, 'modal-open');
        });
      });
      expect(modal.isDisplayed()).toBe(false);
    });

  });
}