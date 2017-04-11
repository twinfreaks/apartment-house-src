import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('check return to blog list button from add blog page', () => {
    let titleInput = element(by.id('title')),
      returnConfirmDialog = element(by.className('ui-confirmdialog')),
      confirmTrueBtn = element(by.className('conf-dial-true')),
      confirmFalseBtn = element(by.className('conf-dial-false')),
      blogsNavBtn = element(by.css('ul.navbar-nav li.nav-item:first-child')),
      blogsList = element(by.css('.blogs')),
      descriptionInput = element(by.id('description')),
      addEditTitle = element(by.css('.breadcrumb h3')),
      addBlogBtn = element(by.id('add-blog-btn')),
      returnToBlogsBtn = element(by.id('return-to-blogs'));

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

    it('it should get add blog page', () => {
      browser.wait(EC.visibilityOf(addBlogBtn), 3000);
      addBlogBtn.click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Adding blog');
      expect(browser.getCurrentUrl()).toContain('blog-add');
    });

    it('it should return to blog list', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/blogs');
    });

    it('it should get add blog page', () => {
      browser.wait(EC.visibilityOf(addBlogBtn), 3000);
      addBlogBtn.click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Adding blog');
      expect(browser.getCurrentUrl()).toContain('blog-add');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(titleInput), 3000);
      titleInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at blog-add page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/blog-add');
    });

    it('it should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to blog list page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/blogs');
    });

    it('it should get add blog page', () => {
      browser.wait(EC.visibilityOf(addBlogBtn), 3000);
      addBlogBtn.click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Adding blog');
      expect(browser.getCurrentUrl()).toContain('blog-add');
    });

    it('it should return to blog list', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/blogs');
    });

    it('it should get add blog page', () => {
      browser.wait(EC.visibilityOf(addBlogBtn), 3000);
      addBlogBtn.click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Adding blog');
      expect(browser.getCurrentUrl()).toContain('blog-add');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(titleInput), 3000);
      descriptionInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at blog-add page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/blog-add');
    });

    it('it should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to blog list page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/blogs');
    });
  });

  describe('check return to blog list button from edit blog page', () => {
    let titleInput = element(by.id('title')),
        returnConfirmDialog = element(by.className('ui-confirmdialog')),
        confirmTrueBtn = element(by.className('conf-dial-true')),
        confirmFalseBtn = element(by.className('conf-dial-false')),
        firstBlogTitle = null,
        firstBlogDescription = null,
        blogTitles = element.all(by.css('.blogs .blog h4')),
        blogDescriptions = element.all(by.css('.blogs .blog p.card-text.text-justify')),
        blogsNavBtn = element(by.css('ul.navbar-nav li.nav-item:first-child')),
        blogsList = element(by.css('.blogs')),
        descriptionInput = element(by.id('description')),
        blogsListBySingleBlog = element.all(by.css('.blogs .blog')),
        addEditTitle = element(by.css('.breadcrumb h3')),
        returnToBlogsBtn = element(by.id('return-to-blogs'));

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

    it('should save first blog title', () => {
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogTitles.first().getText().then((text) => {
        firstBlogTitle = text;
      });
      expect(blogTitles.first().getText()).not.toBe('');
    });

    it('it should get first blog edit page', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-warning.button-control')).click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Editing blog');
      expect(browser.getCurrentUrl()).toContain('blog-edit');
    });

    it('it should return to blog list', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/blogs');
    });

    it('it should get first blog edit page', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-warning.button-control')).click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Editing blog');
      expect(browser.getCurrentUrl()).toContain('blog-edit');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(titleInput), 3000);
      titleInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at blog-edit page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/blog-edit');
    });

     it('it should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to blog list page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/blogs');
    });

    it('title of first blog should be as in "firstBlogTitle" variable', () => {
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(blogTitles.first().getText()).toBe(firstBlogTitle);
    });

    it('should save first blog description', () => {
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogDescriptions.first().getText().then((text) => {
        firstBlogDescription = text;
      });
      expect(blogDescriptions.first().getText()).not.toBe('');
    });

    it('it should get first blog edit page', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-warning.button-control')).click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Editing blog');
      expect(browser.getCurrentUrl()).toContain('blog-edit');
    });

    it('it should return to blog list', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/blogs');
    });

    it('it should get first blog edit page', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-warning.button-control')).click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Editing blog');
      expect(browser.getCurrentUrl()).toContain('blog-edit');
    });

    it('it should check not saved changes > should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(titleInput), 3000);
      descriptionInput.sendKeys(' add some text');
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort confirm, should still stay at blog-edit page', () => {
      browser.wait(EC.visibilityOf(confirmFalseBtn), 3000);
      confirmFalseBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(false);
      expect(browser.getCurrentUrl()).toContain('admin/blog-edit');
    });

    it('it should open confirmation modal dialog', () => {
      browser.wait(EC.visibilityOf(returnToBlogsBtn), 3000);
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(returnConfirmDialog), 3000);
      expect(returnConfirmDialog.isDisplayed()).toBe(true);
    });

    it('it should abort changes, redirect to blog list page', () => {
      browser.wait(EC.visibilityOf(confirmTrueBtn), 3000);
      confirmTrueBtn.click();
      browser.wait(EC.invisibilityOf(returnConfirmDialog), 3000);
      expect(browser.getCurrentUrl()).toContain('admin/blogs');
    });

    it('description of first blog should be as in "firstBlogDescription" variable', () => {
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(blogDescriptions.first().getText()).toBe(firstBlogDescription);
    });
  });
};