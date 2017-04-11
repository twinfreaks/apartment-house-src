import { browser, element, by, protractor } from 'protractor';
import * as moment from 'moment/moment';

let loginHelpers = require('../../shared/login-helpers.ts'),
    EC = protractor.ExpectedConditions;

exports.test = () => {

  describe('add blog', () => {
    let toast = element(by.id('toast-container')),
        toastMessage = toast.element(by.className('toast-message')),
        blogsNavBtn = element(by.css('ul.navbar-nav li.nav-item:first-child')),
        addBlogBtn = element(by.id('add-blog-btn')),
        addEditTitle = element(by.css('.breadcrumb h3')),
        saveBlogBtn = element(by.id('save-blog')),
        titleInput = element(by.id('title')),
        descriptionInput = element(by.id('description')),
        dataPicker = element(by.css('p-calendar[formcontrolname="publicatedFrom"] input')),
        dataPickerBtn = element(by.css('p-calendar[formcontrolname="publicatedFrom"] button')),
        todayDate = moment().format('DD.MM.YYYY'),
        isActiveInput = element(by.id('isActive')),
        isActiveBtn = element(by.css('div.isActive label.switch')),
        isEventBtn = element(by.css('div.isEvent label.switch')),
        eventsDropDown = element(by.id('event')),
        eventsListContainer = element(by.css('p-dropdown[formcontrolname="event"] ul.ui-dropdown-items')),
        eventsList = element.all(by.css('p-dropdown[formcontrolname="event"] ul.ui-dropdown-items li')),
        eventModal = element(by.id('event-modal')),
        eventSaveBtn = eventModal.element(by.className('btn-success')),
        eventCancelBtn = eventModal.element(by.className('btn-primary')),
        eventFormTitleInput = eventModal.element(by.css('input[formcontrolname="title"]')),
        eventFormDescriptionInput = eventModal.element(by.css('textarea[formcontrolname="description"]')),
        blogsList = element(by.css('.blogs')),
        blogsTitles = element.all(by.css('.blogs .blog h4'));

    beforeAll(() => {
      loginHelpers.loginToPageFunc('superadmin', 'superadmin');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    it('it should get blog add page', () => {
      blogsNavBtn.click();
      browser.wait(EC.visibilityOf(addBlogBtn), 3000);
      addBlogBtn.click();
      browser.wait(EC.visibilityOf(addEditTitle), 3000);
      expect(addEditTitle.getText()).toBe('Adding blog');
      expect(browser.getCurrentUrl()).toContain('blog-add');
    });

    it('save blog button should be disabled with clear inputs', () => {
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
    });

    it('save blog button should be disabled with title input filled', () => {
      browser.wait(EC.visibilityOf(titleInput), 3000);
      titleInput.sendKeys('Blog name 1');
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
    });

    it('save blog button should be disabled with title, description inputs filled', () => {
      browser.wait(EC.visibilityOf(descriptionInput), 3000);
      descriptionInput.sendKeys('Blog description 1');
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
    });

    it('save blog button should be disabled with title, description, text inputs filled', () => {
      descriptionInput.sendKeys(protractor.Key.TAB, 'Blog text 1');
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
    });

    it('save blog button should be enabled with title, description, text, date inputs filled', () => {
      browser.wait(EC.visibilityOf(dataPicker), 3000);
      dataPicker.sendKeys(todayDate);
      dataPickerBtn.click();
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(true);
    });

    it('save blog button should be disabled with clear description input', () => {
      descriptionInput.clear();
      descriptionInput.sendKeys('1', protractor.Key.BACK_SPACE);
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
      descriptionInput.sendKeys('Blog description 1');
    });

    it('save blog button should be disabled with clear title input', () => {
      titleInput.clear();
      titleInput.sendKeys('1', protractor.Key.BACK_SPACE);
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
      titleInput.sendKeys('Blog name 1');
    });

    it('save blog button should be disabled with clear date input', () => {
      dataPicker.clear();
      dataPicker.sendKeys('1', protractor.Key.BACK_SPACE);
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
      dataPicker.sendKeys(todayDate);
      dataPickerBtn.click();
    });

    it('it should change isActive state', () => {
      let isActiveState = isActiveInput.isSelected();
      isActiveBtn.click();
      expect(isActiveInput.isSelected()).not.toBe(isActiveState);
    });

    it('it should change isActive state to true', () => {
      let isActiveState = isActiveInput.isSelected();
      isActiveBtn.click();
      expect(isActiveInput.isSelected()).not.toBe(isActiveState);
    });

    it('it should change isEvent to true state and blog save button should be enabled', () => {
      isEventBtn.click();
      expect(saveBlogBtn.isEnabled()).toBe(false);
      isEventBtn.click();
    });

    it('it should choose first empty event line and save Blog button should be disabled', () => {
      isEventBtn.click();
      browser.wait(EC.visibilityOf(eventsDropDown), 3000);
      eventsDropDown.click();
      browser.wait(EC.visibilityOf(eventsListContainer), 3000);
      eventsList.first().click();
      expect(saveBlogBtn.isEnabled()).toBe(false);
      isEventBtn.click();
    });

    it('it should choose existed event and save Blog button should be enabled', () => {
      isEventBtn.click();
      browser.wait(EC.visibilityOf(eventsDropDown), 3000);
      eventsDropDown.click();
      browser.wait(EC.visibilityOf(eventsListContainer), 3000);
      eventsList.get(2).click();
      expect(saveBlogBtn.isEnabled()).toBe(true);
      isEventBtn.click();
    });

    it('it should open add event modal', () => {
      isEventBtn.click();
      browser.wait(EC.visibilityOf(eventsDropDown), 3000);
      eventsDropDown.click();
      browser.wait(EC.visibilityOf(eventsListContainer), 3000);
      eventsList.get(1).click();
      browser.wait(EC.visibilityOf(eventModal), 3000);
      expect(eventModal.isDisplayed()).toBe(true);
    });

    it('it should close add event modal', () => {
      browser.wait(EC.visibilityOf(eventCancelBtn), 3000);
      eventCancelBtn.click();
      browser.wait(EC.invisibilityOf(eventModal), 3000);
      expect(eventModal.isDisplayed()).toBe(false);
    });

    it('Blog save button should be disabled', () => {
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(false);
      browser.wait(EC.visibilityOf(isEventBtn), 3000);
      isEventBtn.click();
    });

    it('it should open add event modal', () => {
      isEventBtn.click();
      browser.wait(EC.visibilityOf(eventsDropDown), 3000);
      eventsDropDown.click();
      browser.wait(EC.visibilityOf(eventsListContainer), 3000);
      eventsList.get(1).click();
      browser.wait(EC.visibilityOf(eventModal), 3000);
      expect(eventModal.isDisplayed()).toBe(true);
    });

    it('it should create new event', () => {
      browser.wait(EC.visibilityOf(eventFormTitleInput), 3000);
      eventFormTitleInput.sendKeys('Event title 1');
      browser.wait(EC.visibilityOf(eventFormDescriptionInput), 3000);
      eventFormDescriptionInput.sendKeys('Event description 1');
      browser.wait(EC.visibilityOf(eventSaveBtn), 3000);
      eventSaveBtn.click();
      browser.wait(EC.invisibilityOf(eventModal), 3000);
      expect(eventModal.isDisplayed()).toBe(false);
      browser.wait(EC.visibilityOf(toast), 3000);
      expect(toastMessage.getText()).toContain('success');
      toast.click();
      browser.wait(EC.invisibilityOf(toast), 3000);
    });

    it('Blog save button should be enabled', () => {
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      expect(saveBlogBtn.isEnabled()).toBe(true);
    });

    it('it should save created blog', () => {
      browser.wait(EC.visibilityOf(saveBlogBtn), 3000);
      saveBlogBtn.click();
      browser.wait(EC.visibilityOf(toast), 3000);
      expect(toastMessage.getText()).toContain('success');
  
      toast.click();
      
      browser.wait(EC.invisibilityOf(toast), 3000);
    });

    it('it should check existence of created blog by title name', () => {
      browser.wait(EC.visibilityOf(blogsList), 3000);
      expect(blogsTitles.first().getText()).toMatch('Blog name 1');
    });
  });
};