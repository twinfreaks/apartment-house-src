import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = (login, password, role) => {

  describe('blogs list test for ' + role, function() {
    let blogsBtn = element(by.css('ul.navbar-nav li.nav-item:first-child')),
        blogsPageTitle = element(by.id('title')),
        blogsList = element.all(by.css('.blogs .blog')),
        blogTitles = element.all(by.css('.blogs .blog h4')),
        blogTitleUrls = element.all(by.css('.blogs .blog h4 a')),
        blogsReadMore = element.all(by.css('.blogs .blog p a'));

    beforeAll(() => {
      loginHelpers.loginToPageFunc(login, password);
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    it('should open blogs list page', () => {
      blogsBtn.click();
      expect(browser.getCurrentUrl()).toMatch(role + '/blogs');
    });

    it('blog title should be "blog"', () => {
      expect(blogsPageTitle.getText()).toMatch('Blog');
    });

    it('count of blogs shouldn\'t be 0', () => {
      expect(blogsList.count()).not.toEqual(0);
    });

    it('title of first blog should "Обслуговуюча організація"', () => {
      expect(blogTitles.first().getText()).toMatch('Обслуговуюча організація');
    });

    it('click on blog title url should redirect to blog single page', () => {
      let firstBlogTitleUrl = blogTitleUrls.first().getAttribute('href');
      blogTitleUrls.first().click();
      expect(browser.getCurrentUrl()).toMatch(String(firstBlogTitleUrl));
    });

    it('browser>navigate>back should redirect to blogs list page', () => {
      browser.navigate().back();
      expect(browser.getCurrentUrl()).toContain(role + '/blogs');
    });

    it('blog title should be "blog"', () => {
      expect(blogsPageTitle.getText()).toMatch('Blog');
    });

    it('click on "read more" link should redirect to blog single page', () => {
      let readMoreUrl = blogsReadMore.first().getAttribute('href');
      browser.driver.wait(EC.visibilityOf(element(by.css('.blogs'))), 3000);
      browser.driver.wait(EC.visibilityOf(blogsReadMore.first()), 3000);
      blogsReadMore.first().click();
      expect(browser.getCurrentUrl()).toMatch(String(readMoreUrl));
    });

    it('should open blogs list page', () => {
      blogsBtn.click();
      expect(browser.getCurrentUrl()).toContain(role + '/blogs');
    });

    it('blog title should be "blog"', () => {
      expect(blogsPageTitle.getText()).toMatch('Blog');
    });
  });
};