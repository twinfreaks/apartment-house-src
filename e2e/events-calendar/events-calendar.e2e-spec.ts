import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions,
    loginHelpers = require('../shared/login-helpers.ts'),
    calendarMenu = require('./shared/calendar-menu.ts'),
    sharedFunc = require('./shared/shared-function.ts'),
    dragDropEdit = require('./admin/drag-drop-edit.ts'),
    addDelete = require('./admin/add-delete.ts'),
    clickEvents = require('./user/clickability.ts');

describe('Calendar events e2e tests', () => {
  browser.get('/');

  describe('admin events calendar', () => {

    beforeAll(() => {
      loginHelpers.loginToPageFunc('adminReceptionist', 'user');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    sharedFunc.goToCalendarEventsViaNavbar('admin');
    calendarMenu.testCalendarMenu();
    dragDropEdit.testDragDropAndEdit();
    addDelete.testAddDelete();
  });

  describe('user events calendar', () => {

    beforeAll(() => {
      loginHelpers.loginToPageFunc('user', 'user');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    sharedFunc.goToCalendarEventsViaNavbar('user');
    calendarMenu.testCalendarMenu();
    clickEvents.testClickable();
  });

});