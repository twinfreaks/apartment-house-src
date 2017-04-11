import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('requests lists', () => {
    let toast = element(by.id('toast-container')),
        toastMessage = toast.element(by.className('toast-message')),
        requestsNavBtn = element(by.css('ul.navbar-nav li.nav-item:nth-child(4)')),
        requestsTitle = element(by.css('.breadcrumb h3')),
        requestsTypeBtn = element(by.id('requests-type-btn')),
        requestsTypeListContainer = element(by.className('dropdown-request-type')),
        requestsTypeList = element.all(by.css('.dropdown-request-type li')),
        requestByTypeContainer = element(by.css('.problem-list tbody')),
        requestByTypeList = element.all(by.css('.problem-list tbody tr')),
        requestByTypeListTitle = element.all(by.css('.problem-list tbody tr td:first-child')),
        currentRequestTypeTitle = element(by.className('current-request-title')),
        notDoneRequestsCount = element(by.css('.current-request-title-wraper span:last-child'));

    beforeAll(() => {
      loginHelpers.loginToPageFunc('superadmin', 'superadmin');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    it('it should get requests page', () => {
      browser.wait(EC.visibilityOf(requestsNavBtn), 3000);
      requestsNavBtn.click();
      browser.wait(EC.visibilityOf(requestsTitle), 3000);
      expect(requestsTitle.getText()).toBe('Requests');
    });

    it('it should click and open requests list', () => {
      browser.wait(EC.visibilityOf(requestsTypeBtn), 3000);
      requestsTypeBtn.click();
      browser.wait(EC.visibilityOf(requestsTypeListContainer), 3000);
      expect(requestsTypeListContainer.isDisplayed()).toBe(true);
    });

    it('count of request types shouldn\'t be 0', () => {
      browser.wait(EC.visibilityOf(requestsTypeListContainer), 3000);
      expect(requestsTypeList.count()).not.toBe(0);
    });

    it('it should choose first request type', () => {
      requestsTypeList.first().click();
      browser.wait(EC.visibilityOf(requestByTypeContainer), 3000);
      expect(requestByTypeContainer.isDisplayed()).toBe(true);
    });

    it('count of requests shouldn\'t be 0', () => {
      browser.wait(EC.visibilityOf(requestByTypeContainer), 3000);
      expect(requestByTypeList.count()).not.toBe(0);
    });

    it('it should click and open requests list', () => {
      browser.wait(EC.visibilityOf(requestsTypeBtn), 3000);
      requestsTypeBtn.click();
      browser.wait(EC.visibilityOf(requestsTypeListContainer), 3000);
      expect(requestsTypeListContainer.isDisplayed()).toBe(true);
    });

    it('it should choose second request type', () => {
      requestsTypeList.get(1).click();
      browser.wait(EC.invisibilityOf(requestsTypeListContainer), 3000);
      expect(requestsTypeListContainer.isDisplayed()).toBe(false);
      browser.wait(EC.visibilityOf(requestByTypeContainer), 3000);
      expect(requestByTypeContainer.isDisplayed()).toBe(true);
    });

    it('title of second request type should be "Газопостачання"', () => {
      expect(currentRequestTypeTitle.getText()).toBe('Газопостачання');
    });

    it('count of requests in type "Газопостачання" shouldn\'t be 0', () => {
      browser.wait(EC.visibilityOf(requestByTypeContainer), 3000);
      expect(requestByTypeList.count()).not.toBe(0);
    });

    it('first request in type "Газопостачання" should be "Витік газу"', () => {
      browser.wait(EC.visibilityOf(requestByTypeContainer), 3000);
      expect(requestByTypeListTitle.last().getText()).toBe('Витік газу');
    });

    it('it should confirm first request > toast message contain "Request is updated"', () => {
      let confirmRequest = requestByTypeList.get(1).element(by.className('btn-warning'));
      browser.wait(EC.visibilityOf(confirmRequest), 3000);
      confirmRequest.click();
      browser.wait(EC.visibilityOf(toast), 3000);
      expect(toastMessage.getText()).toBe('Request is updated');
      toast.click();
      browser.wait(EC.invisibilityOf(toast), 3000);
    });

    it('notDoneRequestsCount should be equal 1', () => {
      browser.wait(EC.visibilityOf(notDoneRequestsCount), 3000);
      expect(notDoneRequestsCount.getText()).toBe('1');
    });
  });
};