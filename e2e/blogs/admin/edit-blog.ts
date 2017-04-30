import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('edit blog', () => {
    let toast = element(by.id('toast-container')),
        toastMessage = toast.element(by.className('toast-message')),
        blogsListBySingleBlog = element.all(by.css('.blogs .blog')),
        blogTitles = element.all(by.css('.blogs .blog h4')),
        blogDescriptions = element.all(by.css('.blogs .blog p.card-text.text-justify')),
        blogsNavBtn = element(by.css('ul.navbar-nav li.nav-item:first-child')),
        addEditTitle = element(by.css('.breadcrumb h3')),
        saveBlogBtn = element(by.id('save-blog')),
        titleInput = element(by.id('title')),
        descriptionInput = element(by.id('description')),
        blogsList = element(by.css('.blogs'));

    beforeAll(() => {
      loginHelpers.loginToPageFunc('adminReceptionist', 'user');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    it('should open blogs list page', () => {
      blogsNavBtn.click();
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

    it('it change title input filled, save blog button should be enabled', () => {
      browser.wait(EC.visibilityOf(titleInput), 3000);
      titleInput.sendKeys(' updated');
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(true);
    });

    it('it should save updated blog', () => {
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      saveBlogBtn.click();
      browser.wait(EC.visibilityOf(toast), 3000);
      expect(toastMessage.getText()).toContain('success');
      toast.click();
      browser.wait(EC.invisibilityOf(toast), 3000);
    });

    it('title of first blog should be "Blog name 1 updated"', () => {
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(blogTitles.first().getText()).toBe('Blog name 1 updated');
    });

    it('it should get first blog edit page', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-warning.button-control')).click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Editing blog');
      expect(browser.getCurrentUrl()).toContain('blog-edit');
    });

    it('it change title input filled, save blog button should be enabled', () => {
      browser.wait(EC.visibilityOf(descriptionInput), 3000);
      descriptionInput.sendKeys(' updated');
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(true);
    });

    it('it should save updated blog', () => {
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      saveBlogBtn.click();
      browser.wait(EC.visibilityOf(toast), 3000);
      expect(toastMessage.getText()).toContain('success');
      toast.click();
      browser.wait(EC.invisibilityOf(toast), 3000);
    });

    it('description of first blog should be "Blog description 1 updated"', () => {
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(blogDescriptions.first().getText()).toContain('Blog description 1 updated');
    });
  });
};