import { browser, element, by, protractor } from 'protractor';

let EC = protractor.ExpectedConditions;

exports.loginToPageFunc = (loginKey, passwordKey) => {
    let login = element(by.css('input[formControlName=username]')),
        password = element(by.css('input[formControlName=password]')),
        loginBtn = element(by.name('submit')),
        toast = element(by.id('toast-container')),
        message = toast.element(by.className('toast-message'));

    browser.get(browser.baseUrl + 'login');
    browser.wait(EC.visibilityOf(login), 3000);
    login.sendKeys(loginKey);
    password.sendKeys(passwordKey);
    loginBtn.click();
    browser.wait(EC.visibilityOf(toast), 3000);
    toast.click();
    browser.wait(EC.invisibilityOf(toast), 3000);
};

exports.logOutFromPageFunc = () => {
    let toast = element(by.id('toast-container')),
        profileMenu = element(by.id("single-button")),
        logoutBtn = element(by.css(".dropdown-menu-right > li:last-child"));

    profileMenu.click();
    browser.wait(EC.visibilityOf(logoutBtn), 3000);
    logoutBtn.click();
    browser.wait(EC.visibilityOf(toast), 3000);
    toast.click();
    browser.wait(EC.invisibilityOf(toast), 3000);
};