import {browser, element, by, protractor} from 'protractor';
import * as _ from 'lodash';
import * as moment from 'moment';

let EC = protractor.ExpectedConditions,
  inhabitant = require('../config-calculation');

exports.testUserCalculations = () => {
  describe('Test user calculations', () => {

    inhabitant = inhabitant.inhabitant;
    let calculations = element.all(by.css('.card-block'));

    it('User see added calculations', () => {
      expect(calculations.get(0).element(by.css('.calculation-title')).getText()).toContain(inhabitant.typeAddedWithinTest);
      expect(calculations.get(1).element(by.css('.calculation-title')).getText()).toContain(inhabitant.calculationType);
    });

    it('Data is correct', () => {
      expect(calculations.get(0).element(by.css('.calculation-date')).getText()).toContain(moment().format('DD/MM/YYYY'));
      expect(calculations.get(1).element(by.css('.calculation-date')).getText()).toContain(moment().format('DD/MM/YYYY'));
      expect(calculations.get(0).element(by.css('.calculation-to-pay')).getText()).toContain(inhabitant.toPay);
      expect(calculations.get(1).element(by.css('.calculation-to-pay')).getText()).toContain(inhabitant.toPay);
    });

    it('Filter by calculation type', () => {
      let numOfCalc;
      calculations.count().then((value) => {
        numOfCalc = value;
      })
      .then(() => {
        element(by.css('.ui-select-container')).click();
        element(by.cssContainingText('.ui-select-choices-row', inhabitant.typeAddedWithinTest)).click();
        browser.sleep(500);
        element.all(by.css('.calculation-title')).each((calculation) => {
          expect(calculation.getText()).toContain(inhabitant.typeAddedWithinTest);
        });
        element(by.css('.ui-select-container')).click();
        element(by.cssContainingText('.ui-select-choices-row', inhabitant.calculationType)).click();
        browser.sleep(500);
        element.all(by.css('.calculation-title')).each((calculation) => {
          expect(calculation.getText()).toContain(inhabitant.calculationType);
        });
        element(by.css('.ui-select-container')).click();
        element(by.cssContainingText('.ui-select-choices-row', 'Show all')).click();
        browser.driver.wait(() => {
          return element.all(by.css('.calculation-title')).first().isPresent();
        });
        expect(calculations.count()).toBe(numOfCalc);
      });
    });
  });
}