import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions;

exports.testAddEditBuildingForm = () => {
  describe('Test add edit building form', () => {

    let form = element(by.id('add-edit-building-form')),
        submitBtn = element(by.css('button[type=submit]'));

    it('Open form after click add button', () => {
      element(by.css('.fa-plus')).click();
      expect(form.isPresent()).toBe(true);
    });

    it('Save button is disabled', () => {
      expect(submitBtn.isEnabled()).toBe(false);
    });

    it('Fill form fields, save button enable', () => {
      element(by.id('street')).sendKeys('test');
      element(by.id('building-number')).sendKeys('1');
      expect(submitBtn.isEnabled()).toBe(true);
    });

    it('Cancel, back to choose building', () => {
      element(by.cssContainingText('button', 'Back')).click();
      expect(form.isPresent()).toBe(false);
    });
  });
}