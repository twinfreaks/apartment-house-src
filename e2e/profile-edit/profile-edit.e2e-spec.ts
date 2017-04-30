import {browser, element, by, protractor} from 'protractor';

let login = require("../shared/login-helpers"),
    funcs = require('../dashboard/funcs.ts'),
    EC = protractor.ExpectedConditions,
    sleep = function (ms) {
      browser.sleep(ms)
    },
    wait = function (condition) {
      return browser.driver.wait(condition)
    },
    waitForPresent = function (element) {
      browser.driver.wait(function () {
        return browser.isElementPresent(element)
      });
    },
    waitForDisplay = function (element) {
      browser.driver.wait(function () {
        return element.isDisplayed();
      })
    };

describe('profile-edit-test', () => {
    let profileMenu = element(by.id("single-button")),
        profileBtn = element(by.css(".dropdown-menu-right > li:nth-child(2)")),
        myForm = element(by.className('profileEditForm')),
        cancelBtn = element(by.cssContainingText('a','Cancel')),
        submitBtn = element(by.className("btn-success")),
        surname = element(by.css('input[formControlName=surname]')),
        name = element(by.css('input[formControlName=name]')),
        patronymic = element(by.css('input[formControlName=patronymic]')),
        phone = element(by.css('.form-control.ui-inputtext.ui-corner-all.ui-state-default.ui-widget')),
        email = element(by.css('input[formControlName=email]')),
        toast = element(by.className('toast')),
        userData = {'name': 'Name', 'surname': 'Surname', 'patronymic': 'Patronymic', 'phone': '0501234567', 'email': 'test_email@gmail.com'};
        
    beforeAll(() => {
        login.loginToPageFunc("user", "user");
    });

    afterAll(() => {
        login.logOutFromPageFunc();
    });

    it("it open user profile edit page", () => {
        profileMenu.click();
        waitForDisplay(profileBtn);
        profileBtn.click();
        waitForDisplay(myForm);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'user/profile');
        sleep(1000);
    });

    it("it clear all inputs, form submit should be disabled", () => {
        waitForDisplay(myForm);
        wait(EC.visibilityOf(surname));
        surname.clear();
        surname.sendKeys('1', protractor.Key.BACK_SPACE)
        wait(EC.visibilityOf(name));
        name.clear();
        name.sendKeys('2', protractor.Key.BACK_SPACE);
        wait(EC.visibilityOf(patronymic));
        patronymic.clear();
        patronymic.sendKeys('3', protractor.Key.BACK_SPACE);
        wait(EC.visibilityOf(phone));
        phone.clear();
        phone.sendKeys('4', protractor.Key.BACK_SPACE);
        wait(EC.visibilityOf(email));
        email.clear();
        email.sendKeys('5', protractor.Key.BACK_SPACE);
        expect(submitBtn.isEnabled()).toBe(false);
        sleep(1000);
    });

    it("it change all inputs, form submit should be enabled", () => {
        waitForDisplay(myForm);
        surname.sendKeys(userData.surname);
        name.sendKeys(userData.name);
        patronymic.sendKeys(userData.patronymic);
        phone.sendKeys(userData.phone);
        email.sendKeys(userData.email);
        expect(submitBtn.isEnabled()).toBe(true);
    });

    it("it check that inputs are filled", () => {
        waitForDisplay(myForm);
        expect(surname.getAttribute("value")).not.toBe(null);
        expect(name.getAttribute("value")).not.toBe(null);
        expect(patronymic.getAttribute("value")).not.toBe(null);
        expect(phone.getAttribute("value")).not.toBe(null);
        expect(email.getAttribute("value")).not.toBe(null);
        sleep(1000);
        expect(submitBtn.isEnabled()).toBe(true);
        sleep(1000);
    });

    it("it check that form saving data", () => {
        waitForDisplay(submitBtn);
        expect(submitBtn.isEnabled()).toBe(true);
        submitBtn.click();
        sleep(2000);
    });

    it("it open user profile edit page and click on cancel button", () => {
        waitForDisplay(toast);
        toast.click();
        wait(EC.invisibilityOf(toast));
        profileMenu.click();
        waitForDisplay(profileBtn);
        profileBtn.click();
        waitForDisplay(myForm);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'user/profile');
        sleep(1000);
        cancelBtn.click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'user');
        sleep(1000);
    });
})