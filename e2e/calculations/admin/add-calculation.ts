import {browser, element, by, protractor} from 'protractor';
import * as _ from 'lodash';

let EC = protractor.ExpectedConditions,
  inhabitant = require('../config-calculation'),
  sharedFunc = require('../shared/shared-function.ts');

exports.testAddCalculation = () => {
  describe('Test ad calculation', () => {

    inhabitant = inhabitant.inhabitant;
    let nextBtn = element(by.cssContainingText('button', 'Next')),
        title = element(by.css('h2.element.text-center'));

    it('Correct data', () => {
      expect(title.getText()).toContain(inhabitant.streetName + ' ' + inhabitant.buildingNumber);
      expect(title.getText()).toContain(inhabitant.calculationType);
    });

    it('All save button disabled', () => {
      element.all(by.css('button.btn-success.pointer')).each((button) => {
        expect(button.isEnabled()).toBe(false);
      });
    });

    addCalculation();

    sharedFunc.clickToast();

    it('Back to choose calculation type page', () => {
      element(by.cssContainingText('.calculation-menu-item', 'Type of calculation')).click();
      expect(title.getText()).toContain('Choose calculation type');
    });

    it('Choose calculation type added with test', () => {
      element(by.cssContainingText('.list-group-item.list-group-item-action.pointer.font-lg', inhabitant.typeAddedWithinTest)).click();
      nextBtn.click();
      expect(title.getText()).toContain(inhabitant.typeAddedWithinTest);
    });

    addCalculation();
    sharedFunc.clickToast();

    function addCalculation() {
      it('Add calculation', () => {
        let inhabitantRow,
            text = inhabitant.appartment + ', ' +  inhabitant.surname + ' ' + inhabitant.name + ' ' + inhabitant.patronymic,
            rows = element.all(by.css('tr'));
        rows.each((row) => {
          row.getText().then((value) => {
            if(_.includes(value, text)){
              inhabitantRow = row;
            }
          });
        })
        .then(() => {
          inhabitantRow.element(by.css('.to-pay')).sendKeys(inhabitant.toPay);
          inhabitantRow.element(by.css('.payed')).sendKeys(inhabitant.payed);
          browser.wait(EC.elementToBeClickable(inhabitantRow.element(by.css('.btn-success.pointer'))));
          inhabitantRow.element(by.css('.btn-success.pointer')).click();
        });
      });
    }
  });
}