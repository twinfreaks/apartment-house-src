import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('add request type', () => {
    let toast = element(by.id('toast-container')),
        toastMessage = toast.element(by.className('toast-message')),
        requestsNavBtn = element(by.css('ul.navbar-nav li.nav-item:nth-child(4)')),
        manageRequestTypes = element(by.className('settings ')),
        pageTitle = element(by.css('.breadcrumb h3')),
        addRequestType = element(by.css('.breadcrumb .btn-success')),
        requestTypeNameInput = element(by.id('name')),
        requestTypeDescriptionInput = element(by.id('description')),
        saveRequestTypeBtn = element(by.css('button[type="submit"]')),
        requestTypesContainer = element(by.css('table tbody')),
        requestTypeTitlesList = element.all(by.css('table tbody tr td:nth-child(2)'));

    beforeAll(() => {
      loginHelpers.loginToPageFunc('superadmin', 'superadmin');
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

    it('it should redirect to adding request type page', () => {
      browser.wait(EC.visibilityOf(addRequestType), 3000);
      addRequestType.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Adding type request');
    });

    it('save request type button should be disabled with clear inputs', () => {
      browser.wait(EC.visibilityOf(saveRequestTypeBtn), 3000);
      expect(saveRequestTypeBtn.isEnabled()).toBe(false);
    });

    it('save request type button should be disabled with title input filled', () => {
      browser.wait(EC.visibilityOf(requestTypeNameInput), 3000);
      requestTypeNameInput.sendKeys('Request type 1');
      browser.wait(EC.visibilityOf(saveRequestTypeBtn), 3000);
      expect(saveRequestTypeBtn.isEnabled()).toBe(false);
    });

    it('save request type button should be enabled with title, description inputs filled', () => {
      browser.wait(EC.visibilityOf(requestTypeDescriptionInput), 3000);
      requestTypeDescriptionInput.sendKeys('Request type description 1');
      browser.wait(EC.visibilityOf(saveRequestTypeBtn), 3000);
      expect(saveRequestTypeBtn.isEnabled()).toBe(true);
    });

    it('save request type button should be disabled with clear title input', () => {
      requestTypeNameInput.clear();
      requestTypeNameInput.sendKeys('1', protractor.Key.BACK_SPACE);
      browser.wait(EC.visibilityOf(saveRequestTypeBtn), 3000);
      expect(saveRequestTypeBtn.isEnabled()).toBe(false);
      requestTypeNameInput.sendKeys('Request type 1');
    });

    it('it should save created request type', () => {
      browser.wait(EC.visibilityOf(saveRequestTypeBtn), 3000);
      saveRequestTypeBtn.click();
      browser.wait(EC.visibilityOf(toast), 3000);
      expect(toastMessage.getText()).toBe('Type is added');
      toast.click();
      browser.wait(EC.invisibilityOf(toast), 3000);
    });

    it('it should check existence of created request type by title name', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(requestTypeTitlesList.last().getText()).toBe('Request type 1');
    });
  });
};