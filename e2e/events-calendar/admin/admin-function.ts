import {browser, element, by, protractor} from 'protractor';
import * as _ from "lodash";

let EC = protractor.ExpectedConditions;

exports.confirmChanges = () => {

    let modal = element(by.css('.modal')),
        modalClose = modal.element(by.css('.close'));

    it('confirm changes', () => {
        modal.element(by.css('.btn.btn-success')).click();
        browser.driver.wait(() => {
            return element(by.tagName('body')).getAttribute('class').then(function(value){
            return !_.includes(value, 'modal-open');
            });
        });
        expect(modal.isDisplayed()).toBe(false);
    });
}

exports.clickOnSuccessToast = () => {

    let toast = element(by.className('toast-top-right'));

    it('Show success toast', () => {
        browser.wait(EC.presenceOf(toast), 5000);
        let message = toast.element(by.className('toast-message'));
        expect(message.getText()).toContain('Changes have been saved');
    });

    it('Click on toast', () => {
        toast.click();
        browser.wait(EC.invisibilityOf(toast), 5000);
        expect(toast.isDisplayed()).toBe(false);
    }); 
}