// before run calculations test make sure data in ininhabitant-data file are correct

import {browser, element, by, protractor} from 'protractor';

let EC = protractor.ExpectedConditions,
    loginHelpers = require('../shared/login-helpers.ts'),
    sharedFunc = require('./shared/shared-function.ts'),
    chooseBuilding = require('./admin/choose-building.ts'),
    chooseType = require('./admin/choose-add-calculation-type.ts'),
    addCalculation = require('./admin/add-calculation.ts'),
    userCalculation = require('./user/user-calculation.ts'),
    editDeleteType = require('./admin/edit-delete-calculation-type.ts');

describe('Calculations e2e test', () => {

  browser.get('/');

  describe('Admin part calculations e2e test', () => {

    beforeAll(() => {
      loginHelpers.loginToPageFunc('superadmin', 'superadmin');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });

    sharedFunc.goToCalculationsViaNavbar('admin');
    sharedFunc.testTitle();
    chooseBuilding.testChooseBuilding();
    chooseType.testChooseCalculationType();
    addCalculation.testAddCalculation();
  });

  describe('User part calculations e2e test', () => {
    beforeAll(() => {
      loginHelpers.loginToPageFunc('user', 'user');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });
    sharedFunc.goToCalculationsViaNavbar('user');
    sharedFunc.testTitle();
    userCalculation.testUserCalculations();
  });

  describe('Admin part calculations e2e test', () => {
    beforeAll(() => {
      loginHelpers.loginToPageFunc('superadmin', 'superadmin');
    });

    afterAll(() => {
      loginHelpers.logOutFromPageFunc();
    });
    sharedFunc.goToCalculationsViaNavbar('admin');
    sharedFunc.testTitle();
    editDeleteType.testEditDeleteCalculationType();
  });

});