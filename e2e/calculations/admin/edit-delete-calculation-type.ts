import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions,
  inhabitant = require('../config-calculation'),
  sharedFunc = require('../shared/shared-function.ts');

exports.testEditDeleteCalculationType = () => {
  describe('Test edit delete calculation type', () => {

    inhabitant = inhabitant.inhabitant;
    let typeToTest = element(by.cssContainingText('.list-group-item.list-group-item-action.pointer.font-lg', inhabitant.typeAddedWithinTest)),
        nextBtn = element(by.cssContainingText('button', 'Next')),
        prevBtn = element(by.cssContainingText('button', 'Back'));

    it('Choose building, go to calculation types page', () => {
      element(by.css('.ui-select-match')).click();
      element(by.cssContainingText('.dropdown-item', inhabitant.streetName + ' ' + inhabitant.buildingNumber)).click();
      nextBtn.click();
      expect(nextBtn.isEnabled()).toBe(false);
    });

    it('Edit added calculation type', () => {
      typeToTest.click();
      expect(nextBtn.isEnabled()).toBe(true);
      typeToTest.element(by.css('.fa-pencil-square-o')).click();
      expect(element(by.id('add-edit-calculation-type')).isPresent()).toBe(true);
      element(by.id('name')).sendKeys('123');
      element(by.css('button[type=submit]')).click();
    });

    sharedFunc.clickToast();

    it('Edited correct', () => {
      prevBtn.click();
      nextBtn.click();
      browser.driver.wait(() => {
        return element(by.cssContainingText('.list-group-item.list-group-item-action.pointer.font-lg', inhabitant.typeAddedWithinTest + '123')).isPresent();
      });
      expect(typeToTest.getText()).toContain('123');
    });

    it('Delete calculation type', () => {
      let confirmBtn = element(by.css('.conf-dial-true'));
      typeToTest.element(by.css('.fa-trash-o')).click();
      browser.wait(EC.elementToBeClickable(confirmBtn));
      confirmBtn.click();
    });

    sharedFunc.clickToast();

    it('Calculation type deleted', () => {
      expect(typeToTest.isPresent()).toBe(false);
      expect(nextBtn.isEnabled()).toBe(false);
    });

  });
}