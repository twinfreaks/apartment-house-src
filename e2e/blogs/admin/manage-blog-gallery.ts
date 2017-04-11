import { browser, element, by, protractor } from 'protractor';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('check modal viewer for admin add edit blog gallery, deleting image from gallery', () => {
    let toast = element(by.id('toast-container')),
        toastMessage = toast.element(by.className('toast-message')),
        blogsNavBtn = element(by.css('ul.navbar-nav li.nav-item:first-child')),
        blogsList = element(by.css('.blogs')),
        blogsListBySingleBlog = element.all(by.css('.blogs .blog')),
        blogTitleUrls = element.all(by.css('.blogs .blog h4 a')),
        addEditTitle = element(by.css('.breadcrumb h3')),
        imagesCountBeforeDelete = null,
        imagesCountAfterDelete = null,
        galleryInSinglePage = element(by.className('ng2-image-gallery-thumbnails')),
        imagesInGalleryInSinglePage = element.all(by.css('.ng2-image-gallery-thumbnails .ng2-image-gallery-thumbnail-container')),
        galleryAddEditBlog = element(by.className('gallery')),
        imagesInGalleryAddEditBlog = element.all(by.css('.gallery .thumbnails-container')),
        returnToBlogsBtn = element(by.id('return-to-blogs')),
        saveBlogBtn = element(by.id('save-blog')),
        imageModal = element(by.css('.modal img'));

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

    it('it should get first blog edit page', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogsListBySingleBlog.first().element(by.css('.btn-warning.button-control')).click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Editing blog');
      expect(browser.getCurrentUrl()).toContain('blog-edit');
    });

    it('click on first image should open modal image viewer', () => {
      let zoomImageBtn = imagesInGalleryAddEditBlog.first().element(by.className('fa-search-plus'));
      browser.wait(EC.visibilityOf(galleryAddEditBlog), 3000);
      browser.actions().mouseMove(imagesInGalleryAddEditBlog.first()).perform();
      browser.wait(EC.visibilityOf(zoomImageBtn), 3000);
      zoomImageBtn.click();
      browser.wait(EC.visibilityOf(imageModal), 3000);
      expect(imageModal.isDisplayed()).toBe(true);
    });

    it('it should close modal image viewer', () => {
      imageModal.click();
      browser.wait(EC.invisibilityOf(imageModal), 3000);
      expect(imageModal.isDisplayed()).toBe(false);
    });

    it('click on last image should open modal image viewer', () => {
      let zoomImageBtn = imagesInGalleryAddEditBlog.last().element(by.className('fa-search-plus'));
      browser.wait(EC.visibilityOf(galleryAddEditBlog), 3000);
      browser.actions().mouseMove(imagesInGalleryAddEditBlog.last()).perform();
      browser.wait(EC.visibilityOf(zoomImageBtn), 3000);
      zoomImageBtn.click();
      browser.wait(EC.visibilityOf(imageModal), 3000);
      expect(imageModal.isDisplayed()).toBe(true);
    });

    it('it should close modal image viewer', () => {
      imageModal.click();
      browser.wait(EC.invisibilityOf(imageModal), 3000);
      expect(imageModal.isDisplayed()).toBe(false);
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

    it('it should count images in blog add edit gallery, count should be greater then 0', () => {
      browser.wait(EC.visibilityOf(galleryAddEditBlog), 3000);
      imagesInGalleryAddEditBlog.count().then((count) => {
        imagesCountBeforeDelete = count;
      });
      expect(imagesInGalleryAddEditBlog.count()).toBeGreaterThan(0);
    });

    it('it should return to blog list', () => {
      returnToBlogsBtn.click();
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(browser.getCurrentUrl()).toMatch('admin/blogs');
    });

    it('it should redirect to first blog single page', () => {
      let firstBlogTitleUrl = blogTitleUrls.first().getAttribute('href');
      blogTitleUrls.first().click();
      expect(browser.getCurrentUrl()).toMatch(String(firstBlogTitleUrl));
    });

    it('it should count images in blog single page gallery, count should be equal to imagesCountBeforeDelete', () => {
      browser.wait(EC.visibilityOf(galleryInSinglePage), 3000);
      expect(imagesInGalleryInSinglePage.count()).toEqual(imagesCountBeforeDelete);
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

    it('it should delete one image from blog add edit gallery', () => {
      let deleteImageBtn = imagesInGalleryAddEditBlog.first().element(by.className('fa-trash-o'));
      browser.wait(EC.visibilityOf(galleryAddEditBlog), 3000);
      browser.actions().mouseMove(imagesInGalleryAddEditBlog.first()).perform();
      browser.wait(EC.visibilityOf(deleteImageBtn), 3000);
      deleteImageBtn.click();

      imagesInGalleryAddEditBlog.count().then((count) => {
        imagesCountAfterDelete = count;
      });
      expect(imagesInGalleryAddEditBlog.count()).toEqual(imagesCountBeforeDelete - 1);
    });

    it('it should save updated blog', () => {
        browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
        saveBlogBtn.click();
        browser.wait(EC.visibilityOf(toast), 3000);
        expect(toastMessage.getText()).toContain('success');
        toast.click();
        browser.wait(EC.invisibilityOf(toast), 3000);
      });

    it('it should redirect to first blog single page', () => {
      let firstBlogTitleUrl = blogTitleUrls.first().getAttribute('href');
      browser.wait(EC.visibilityOf(blogsList), 3000);
      blogTitleUrls.first().click();
      expect(browser.getCurrentUrl()).toMatch(String(firstBlogTitleUrl));
    });

    it('it should count images in blog single page gallery, count should be equal to imagesCountAfterDelete', () => {
      browser.wait(EC.visibilityOf(galleryInSinglePage), 3000);
      expect(imagesInGalleryInSinglePage.count()).toEqual(imagesCountAfterDelete);
    });
  });
};