import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions,
    inhabitant = require('../config-calculation'),
    sharedFunc = require('../shared/shared-function.ts');

exports.testChooseCalculationType = () => {
  describe('Test choose calculation type page', () => {

    inhabitant = inhabitant.inhabitant;

    let choosen = element(by.css('.list-group-item.list-group-item-action.pointer.active')),
        nextBtn = element(by.cssContainingText('button', 'Next')),
        prevBtn = element(by.cssContainingText('button', 'Back')),
        types = element.all(by.css('.list-group-item.list-group-item-action.pointer.font-lg')),
        typeToTest = element(by.cssContainingText('.list-group-item.list-group-item-action.pointer.font-lg', inhabitant.calculationType)),
        numBefore;

    it('Next button disabled, type not choosen', () => {
      expect((choosen.isPresent())).toBe(false);
      expect(nextBtn.isEnabled()).toBe(false);
    });

    it('Choose calculation type', () => {
      typeToTest.click();
      expect(choosen.isPresent()).toBe(true);
      expect(choosen.getText()).toContain(inhabitant.calculationType);
      expect(nextBtn.isEnabled()).toBe(true);
    });

    it('Open add new calculation type form', () => {
      types.count().then((value) => {
        numBefore = value;
        element(by.css('.fa-plus')).click();
        expect(element(by.id('add-edit-calculation-type')).isPresent()).toBe(true);
      });
    });

    it('Add calculation type', () => {
      element(by.id('name')).sendKeys(inhabitant.typeAddedWithinTest);
      element(by.css('button[type=submit]')).click();
      types = element.all(by.css('.list-group-item.list-group-item-action.pointer.font-lg'));
      browser.driver.wait(() => {
        return types.count().then((value) => {
          return value == numBefore + 1;
        });
      }, 4000);
      expect(types.count()).toBe(numBefore + 1);
    });

    sharedFunc.clickToast();

    it('Search works', () => {
      let search = element(by.css('.form-group.input-group.element input'))
      search.sendKeys(inhabitant.calculationType);
      browser.driver.wait(() => {
        return types.count().then((value) => {
          return value < numBefore + 1;
        });
      }, 4000);
      expect(types.count()).toBeLessThan(numBefore + 1);
      expect(types.get(0).getText()).toContain(inhabitant.calculationType);
      search.clear();
      search.sendKeys('1', protractor.Key.BACK_SPACE);
      browser.driver.wait(() => {
        return types.count().then((value) => {
          return value == numBefore + 1;
        });
      }, 4000);
      expect(types.count()).toBe(numBefore + 1);
    });

    it('Go to add calculation page', () => {
      typeToTest.click();
      nextBtn.click();
    });

  });
}