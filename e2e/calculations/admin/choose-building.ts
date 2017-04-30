import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions,
    inhabitant = require('../config-calculation'),
    addEditBuildingForm = require('./add-edit-building-form.ts');

exports.testChooseBuilding = () => {
    describe('Test choose building page', () => {

      inhabitant = inhabitant.inhabitant;
      let dropdown = element(by.css('.ui-select-choices.dropdown-menu')),
          choosen = element(by.css('.list-group-item.list-group-item-action.pointer.active')),
          nextBtn = element(by.cssContainingText('button', 'Next')),
          prevBtn = element(by.cssContainingText('button', 'Back'));

      it('Next button disabled, building not choosen', () => {
        expect((choosen.isPresent())).toBe(false);
        expect(nextBtn.isEnabled()).toBe(false);
      });

      it('Open dropdown menu', () => {
        let select = element(by.css('.ui-select-match'));
        select.click();
        expect(dropdown.isDisplayed()).toBe(true);
      });

      it('Choose building, next button enable', () => {
        let building = dropdown.element(by.cssContainingText('.dropdown-item', inhabitant.streetName + ' ' + inhabitant.buildingNumber));
        building.click();
        expect(choosen.isDisplayed()).toBe(true);
        expect(choosen.getText()).toBe('Str. ' + inhabitant.streetName + ', Hs. ' + inhabitant.buildingNumber);
        expect(nextBtn.isEnabled()).toBe(true);
      });

      addEditBuildingForm.testAddEditBuildingForm();

      it('Go to next and back, building still choosen', () => {
        browser.wait(EC.elementToBeClickable(nextBtn), 4000);
        nextBtn.click();
        browser.wait(EC.elementToBeClickable(prevBtn), 4000);
        prevBtn.click();
        browser.wait(EC.elementToBeClickable(nextBtn), 4000);
        expect(choosen.isDisplayed()).toBe(true);
        expect(choosen.getText()).toBe('Str. ' + inhabitant.streetName + ', Hs. ' + inhabitant.buildingNumber);
        expect(nextBtn.isEnabled()).toBe(true);
        nextBtn.click();
      });

    });
}