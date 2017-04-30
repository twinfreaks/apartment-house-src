import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('delete request type', () => {
    let deleteConfirmDialog = element(by.className('ui-confirmdialog')),
        confirmTrueBtn = element(by.className('conf-dial-true')),
        confirmFalseBtn = element(by.className('conf-dial-false')),
        toast = element(by.id('toast-container')),
        toastMessage = toast.element(by.className('toast-message')),
        requestsNavBtn = element(by.css('ul.navbar-nav li.nav-item:nth-child(4)')),
        manageRequestTypes = element(by.className('settings ')),
        pageTitle = element(by.css('.breadcrumb h3')),
        requestTypesContainer = element(by.css('table tbody')),
        requestTypesList = element.all(by.css('table tbody tr')),
        requestTypeTitlesList = element.all(by.css('table tbody tr td:nth-child(2)'));

    beforeAll(() => {
      loginHelpers.loginToPageFunc('adminReceptionist', 'user');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    it('it should get requests page', () => {
      browser.wait(EC.visibilityOf(requestsNavBtn), 3000);
      requestsNavBtn.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Requests');
    });

    it('it should redirect to managing request types page', () => {
      browser.wait(EC.visibilityOf(manageRequestTypes), 3000);
      manageRequestTypes.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Request types');
    });

    it('it click delete last request type Btn and should open confirmation modal dialog', () => {
      let deleteRequestTypeBtn = requestTypesList.last().element(by.className('btn-danger'));
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      deleteRequestTypeBtn.click();
      browser.wait(EC.visibilityOf(deleteConfirmDialog), 3000);
      expect(deleteConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at request types list page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(deleteConfirmDialog), 3000);
      expect(deleteConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toMatch('admin/request-types');
    });

    it('it click delete last request type Btn and should open confirmation modal dialog', () => {
      let deleteRequestTypeBtn = requestTypesList.last().element(by.className('btn-danger'));
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      deleteRequestTypeBtn.click();
      browser.wait(EC.visibilityOf(deleteConfirmDialog), 3000);
      expect(deleteConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should delete request type', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(deleteConfirmDialog), 3000);
      browser.wait(EC.visibilityOf(toast), 3000);
      expect(toastMessage.getText()).toBe('Type is deleted');
      toast.click();
      browser.wait(EC.invisibilityOf(toast), 3000);
    });

    it('last request type title shouldn\'t be "Request type 1 updated"', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(requestTypeTitlesList.last().getText()).not.toBe('Request type 1 updated');
    });
  });
};