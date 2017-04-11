import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('check return to request types list button from add request type page', () => {
    let returnConfirmDialog = element(by.className('ui-confirmdialog')),
        confirmTrueBtn = element(by.className('conf-dial-true')),
        confirmFalseBtn = element(by.className('conf-dial-false')),
        requestsNavBtn = element(by.css('ul.navbar-nav li.nav-item:nth-child(4)')),
        manageRequestTypes = element(by.className('settings ')),
        pageTitle = element(by.css('.breadcrumb h3')),
        addRequestType = element(by.css('.breadcrumb .btn-success')),
        requestTypeNameInput = element(by.id('name')),
        requestTypeDescriptionInput = element(by.id('description')),
        returnToRequestTypesBtn = element(by.className('btn-warning')),
        requestTypesContainer = element(by.css('table tbody'));

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

    it('it should return to request types list', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/request-types');
    });

    it('it should redirect to adding request type page', () => {
      browser.wait(EC.visibilityOf(addRequestType), 3000);
      addRequestType.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Adding type request');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(requestTypeNameInput), 3000);
      requestTypeNameInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at adding type request page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/add-request-type');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to managing request types page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/request-types');
    });

    it('it should redirect to adding request type page', () => {
      browser.wait(EC.visibilityOf(addRequestType), 3000);
      addRequestType.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Adding type request');
    });

    it('it should return to blog list', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/request-types');
    });

    it('it should redirect to adding request type page', () => {
      browser.wait(EC.visibilityOf(addRequestType), 3000);
      addRequestType.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Adding type request');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(requestTypeDescriptionInput), 3000);
      requestTypeDescriptionInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at adding type request page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/add-request-type');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to managing request types page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/request-types');
    });
  });

  describe('check return to request types list button from add request type page', () => {
    let lastRequestTypeTitle = null,
        lastRequestTypeDescription = null,
        returnConfirmDialog = element(by.className('ui-confirmdialog')),
        confirmTrueBtn = element(by.className('conf-dial-true')),
        confirmFalseBtn = element(by.className('conf-dial-false')),
        requestsNavBtn = element(by.css('ul.navbar-nav li.nav-item:nth-child(4)')),
        manageRequestTypes = element(by.className('settings ')),
        pageTitle = element(by.css('.breadcrumb h3')),
        requestTypeNameInput = element(by.id('name')),
        requestTypeDescriptionInput = element(by.id('description')),
        returnToRequestTypesBtn = element(by.className('btn-warning')),
        requestTypesContainer = element(by.css('table tbody')),
        requestTypesList = element.all(by.css('table tbody tr')),
        requestTypeTitlesList = element.all(by.css('table tbody tr td:nth-child(2)')),
        requestTypeDescriptionsList = element.all(by.css('table tbody tr td:nth-child(3)'));

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

    it('should save last request type title', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      requestTypeTitlesList.last().getText().then((text) => {
        lastRequestTypeTitle = text;
      });
      expect(requestTypeTitlesList.last().getText()).not.toBe('');
    });

    it('should save last request type description', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      requestTypeDescriptionsList.last().getText().then((text) => {
        lastRequestTypeDescription = text;
      });
      expect(requestTypeDescriptionsList.last().getText()).not.toBe('');
    });

    it('it should redirect to edit last request type page', () => {
      let editRequestTypeBtn = requestTypesList.last().element(by.className('btn-warning'));
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      editRequestTypeBtn.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Editing type request');
    });

    it('it should return to request types list', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/request-types');
    });

    it('it should redirect to edit last request type page', () => {
      let editRequestTypeBtn = requestTypesList.last().element(by.className('btn-warning'));
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      editRequestTypeBtn.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Editing type request');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(requestTypeNameInput), 3000);
      requestTypeNameInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at editing type request page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/edit-request-type');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to managing request types page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/request-types');
    });

    it('title of last blog should be as in "lastRequesttypeTitle" variable', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(requestTypeTitlesList.last().getText()).toBe(lastRequestTypeTitle);
    });

    it('it should redirect to edit last request type page', () => {
      let editRequestTypeBtn = requestTypesList.last().element(by.className('btn-warning'));
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      editRequestTypeBtn.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Editing type request');
    });

    it('it should return to blog list', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/request-types');
    });

    it('it should redirect to edit last request type page', () => {
      let editRequestTypeBtn = requestTypesList.last().element(by.className('btn-warning'));
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      editRequestTypeBtn.click();
      browser.wait(EC.visibilityOf(pageTitle), 3000);
      expect(pageTitle.getText()).toBe('Editing type request');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(requestTypeDescriptionInput), 3000);
      requestTypeDescriptionInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at editing type request page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/edit-request-type');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToRequestTypesBtn), 3000);
      returnToRequestTypesBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to managing request types page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/request-types');
    });

    it('description of last blog should be as in "lastRequestTypeDescription" variable', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(requestTypeDescriptionsList.last().getText()).toBe(lastRequestTypeDescription);
    });
  });
};