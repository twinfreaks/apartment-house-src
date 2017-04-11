import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('request types list', () => {
    let requestsNavBtn = element(by.css('ul.navbar-nav li.nav-item:nth-child(4)')),
        manageRequestTypes = element(by.className('settings ')),
        pageTitle = element(by.css('.breadcrumb h3')),
        requestTypesContainer = element(by.css('table tbody')),
        requestTypesList = element.all(by.css('table tbody tr')),
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

    it('count of request types shouldn\'t be equal 0', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(requestTypesList.count()).not.toBe(0);
    });

    it('first request type title should be "Газопостачання"', () => {
      browser.wait(EC.visibilityOf(requestTypesContainer), 3000);
      expect(requestTypeTitlesList.first().getText()).toBe('Газопостачання');
    });
  });
};