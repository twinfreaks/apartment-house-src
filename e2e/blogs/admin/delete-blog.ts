import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('delete blog', () => {
    let deleteConfirmDialog = element(by.className('ui-confirmdialog')),
        confirmTrueBtn = element(by.className('conf-dial-true')),
        confirmFalseBtn = element(by.className('conf-dial-false')),
        blogsListBySingleBlog = element.all(by.css('.blogs .blog')),
        blogsNavBtn = element(by.css('ul.navbar-nav li.nav-item:first-child')),
        blogsTitle = element.all(by.css('.blogs .blog h4')),
        blogsList = element(by.css('.blogs'));

    beforeAll(() => {
      loginHelpers.loginToPageFunc('superadmin', 'superadmin');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    it('should open blogs list page', () => {
      blogsNavBtn.click();
      expect(browser.getCurrentUrl()).toMatch('admin/blogs');
    });

    it('it click delete blog Btn and should open confirmation modal dialog', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-danger.button-control')).click();
      browser.wait(EC.visibilityOf(deleteConfirmDialog), 3000);
      expect(deleteConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at blog list page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(deleteConfirmDialog), 3000);
      expect(deleteConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toMatch('admin/blogs');
    });

    it('it click delete blog Btn and should open confirmation modal dialog', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-danger.button-control')).click();
      browser.wait(EC.visibilityOf(deleteConfirmDialog), 3000);
      expect(deleteConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should delete blog', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(deleteConfirmDialog), 3000);
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(blogsTitle.first().getText()).not.toBe('Blog name 1 updated');
    });
  });
};